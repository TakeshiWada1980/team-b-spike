import { NextResponse } from "next/server";
import OpenAI from "openai";

export const dynamic = "force-dynamic";

export const GET = async () => {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // GitHubのリポジトリ情報
    // これにあわせて Personal Access Token (Fine-grained tokens) を発行して
    // 環境変数 GITHUB_TOKEN に設定しておくこと
    const owner = "TakeshiWada1980";
    const repo = "ts-study";
    const target = `${owner}/${repo}`;

    const prompt = `${target} の最近のコミット（具体的な内容の解説を含む）をカジュアルな学習成果の発信としてSNS投稿する文章を作成して。ハッシュタグは不要`;
    // const prompt = `${target} の内容を踏まえて、イシューを1個作成してください。\n- マイルストーンは指定しない\n- 担当者（assignees）も指定しない\n- ラベル（labels）も不要`;

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      tools: [
        {
          type: "mcp",
          server_label: "github-remote", // 任意ラベル
          server_url: "https://api.githubcopilot.com/mcp/", // Remote MCP Endpoint
          require_approval: "never",
          allowed_tools: [
            // https://github.com/github/github-mcp-server?tab=readme-ov-file#tools
            "list_commits",
            "get_commit",
            "get_file_contents",
            "create_issue",
            "add_issue_comment",
            "get_issue",
            "list_issues",
          ],
          headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          },
        },
      ],
      input: prompt,
    });

    // Debug
    console.log(JSON.stringify(response, null, 2));

    return NextResponse.json({
      msg: response.output_text,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ msg: "問題が発生しました" }, { status: 500 });
  }
};
