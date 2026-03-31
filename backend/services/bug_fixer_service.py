from models.bug_fixer_models import BugFixRequest, BugFixResponse
from config import settings
from utils.logger import get_logger

logger = get_logger(__name__)


class BugFixerService:
    def __init__(self):
        self.model = settings.AI_MODEL
        self.api_key = settings.AI_API_KEY

    async def analyze_and_fix(self, request: BugFixRequest) -> BugFixResponse:
        logger.info(f"Analyzing {request.language} code snippet...")
        prompt = self._build_prompt(request)
        raw_response = await self._call_ai(prompt)
        return self._parse_response(raw_response, request)

    def _build_prompt(self, request: BugFixRequest) -> str:
        parts = [
            f"You are an expert {request.language} developer and code reviewer.",
            "Analyze the following code ONLY for actual syntax errors, runtime errors, or logic bugs.",
            "DO NOT suggest style improvements, best practices, or refactoring unless they cause actual bugs.",
            "If the code is correct and has NO bugs, say so clearly.",
            "",
            "Respond in this EXACT format:",
            "BUGS_FOUND:",
            "- bug 1 (or write 'None' if no bugs found)",
            "FIXED_CODE:",
            "paste the fixed code here (or paste original code unchanged if no bugs)",
            "EXPLANATION:",
            "explain what was fixed, or say the code is correct if no bugs were found",
            "",
            f"Code to analyze:\n```{request.language}\n{request.code}\n```",
        ]
        if request.error_message:
            parts.append(f"\nError message:\n{request.error_message}")
        if request.context:
            parts.append(f"\nContext:\n{request.context}")
        return "\n".join(parts)

    async def _call_ai(self, prompt: str) -> str:
        from groq import AsyncGroq
        client = AsyncGroq(api_key=self.api_key)
        response = await client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1,
            max_tokens=2048,
        )
        return response.choices[0].message.content

    def _parse_response(self, raw: str, request: BugFixRequest) -> BugFixResponse:
        bugs_found = []
        fixed_code = request.code
        explanation = ""

        try:
            if "BUGS_FOUND:" in raw:
                bugs_section = raw.split("BUGS_FOUND:")[1].split("FIXED_CODE:")[0]
                bugs = [
                    line.strip().lstrip("- ").strip()
                    for line in bugs_section.strip().splitlines()
                    if line.strip() and line.strip() != "-"
                ]
                bugs_found = [b for b in bugs if b.lower() != "none"]

            if "FIXED_CODE:" in raw:
                fixed_section = raw.split("FIXED_CODE:")[1]
                if "EXPLANATION:" in fixed_section:
                    fixed_code = fixed_section.split("EXPLANATION:")[0].strip()
                else:
                    fixed_code = fixed_section.strip()
                fixed_code = fixed_code.strip("```").strip()
                if fixed_code.startswith(request.language):
                    fixed_code = fixed_code[len(request.language):].strip()

            if "EXPLANATION:" in raw:
                explanation = raw.split("EXPLANATION:")[1].strip()

        except Exception as e:
            logger.error(f"Parsing error: {e}")
            fixed_code = request.code
            bugs_found = []
            explanation = raw

        return BugFixResponse(
            original_code=request.code,
            fixed_code=fixed_code,
            explanation=explanation,
            bugs_found=bugs_found if bugs_found else [],
            language=request.language,
        )