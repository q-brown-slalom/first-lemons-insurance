# symphony/agents/product_agent.py
"""
CLI interface for the Product Agent.
Called by GitHub Actions with issue context.
Outputs refined requirements to a markdown file.
"""
import argparse
from openai import OpenAI

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--issue-number", required=True)
    parser.add_argument("--issue-title", required=True)
    parser.add_argument("--issue-body", required=True)
    parser.add_argument("--context", default="")
    parser.add_argument("--repo-structure", default="")
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    client = OpenAI()
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": PRODUCT_AGENT_PROMPT},
            {"role": "user", "content": f"""
Issue #{args.issue_number}: {args.issue_title}

{args.issue_body}

Previous context/feedback:
{args.context}

Repository structure:
{args.repo_structure}
"""}
        ]
    )

    with open(args.output, "w") as f:
        f.write(response.choices[0].message.content)

if __name__ == "__main__":
    main()