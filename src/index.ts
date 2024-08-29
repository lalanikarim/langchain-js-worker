/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { CloudflareWorkersAI } from "@langchain/cloudflare"
import { PromptTemplate } from "@langchain/core/prompts"
import { StringOutputParser } from "@langchain/core/output_parsers"

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const model = new CloudflareWorkersAI({
			model: env.MODEL,
			cloudflareAccountId: env.CLOUDFLARE_ACCOUNT_ID,
			cloudflareApiToken: env.CLOUDFLARE_API_TOKEN,
		});

		try {
			const data = await request.json();
			let prompt = "";
			let messages = [];
			if (data.prompt) {
				prompt = data.prompt;
				messages = data.messages ?? [];
			} else {
				throw new Error("prompt parameter missing.");
			}
			try {
				const promptTemplate = PromptTemplate.fromTemplate(
					`You are a helpful AI companion. Have a conversation with the user with the aim of uplifting their day.
Keep your responses short and concise and keep the tone cheerful and positive.

{messages}
Human: {prompt}
AI: `
				);
				const chain = promptTemplate.pipe(model).pipe(new StringOutputParser());
				const response = await chain.invoke({messages, prompt});
				return Response.json({response});
			}
			catch(error)
			{
				return Response.json({"error": error.toString() },{status: 500});
			}
		}
		catch (error) {
			return Response.json({"error": error.toString() },{status: 422});
		}
	},
} satisfies ExportedHandler<Env>;
