# LangChain JS + Cloudflare Worker
This project demonstrating how to host a [LangChain JS](https://js.langchain.com/v0.2/docs/introduction/) AI/LLM application using [Cloulflare Workers](https://workers.cloudflare.com/).

# Setup Instructions

Follow these steps to set up and run the project locally:

1. **Download or Clone the Repository**  
   Download the code from the repository or clone it using the following command:
     ```bash
     git clone <repository-url>
     ```

2. **Navigate to the Source Folder**  
   Open a terminal and change directory into the source folder:
     ```bash
     cd path/to/source-folder
     ```

3. **Install Package Dependencies**  
   Install the required package dependencies by running:
     ```bash
     npm install
     ```

4. **Set Up Cloudflare Credentials**  
   To test locally, you'll need your Cloudflare Account ID and an API Token with access to Workers AI.
   You can access you Account ID by visiting the Cloudflare Dashboard.
     - On the left hand navigation menu, expand "AI" and click "Workers AI".
     - On the next page, under "Models" tab, click "Use REST API".
     - You should find your Account ID on the next page.
   You can create an API Token by visiting [https://dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens).
     - There, click "Create Token".
     - On the next screen, click use the "Workers AI" template, and go with default options.
   Create a `.dev.vars` file in the root of the project and add the following lines, replacing the placeholders with your actual credentials:
     ```bash
     CLOUDFLARE_ACCOUNT_ID=<your-account-id>
     CLOUDFLARE_API_TOKEN=<your-api-token>
     ```

5. **Test Locally**  
   Run the following command in the terminal to start the Cloudflare Worker locally:
     ```bash
     npx wrangler dev
     ```
   This will host the Cloudflare Worker locally at the address [http://localhost:8787/](http://localhost:8787/).

6. **Make API Requests**  
   You can now make API requests to the local server. For example, make a `POST` request to the server with a `prompt` parameter to ask a question.
   Additionally, you can include an array of messages in the `messages` parameter to provide context.
     ```bash
     curl -X POST http://localhost:8787/ --data '{"prompt":"What was the secret passcode?","messages":["Here is the secret passcode: LangChain rocks!"]}'
     ```
     Sample response:
     ```json
     {"response":"You want to share the secret passcode with me? It was \"LangChain rocks!\" Ah, love the enthusiasm! That's a great reminder that even technology can have a fun and playful side. How's your day going so far?"}
     ```

   Your local environment should now be set up and ready for development.

7. **Securing sensitive configuration for Cloudflare Workers**  
   Before you deploy the application to Cloudflare, you have to decide how you'll handle the environment variables for `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN`, considering both are considered sensitive.
   [Cloudflare Secrets](https://developers.cloudflare.com/workers/configuration/secrets/) provide a secure way of handling sensitive configuration data.
   You can create secrets for `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` using the command:
   ```bash
   npx wrangler secrets put CLOUDFLARE_ACCOUNT_ID
   ```
   and
   ```bash
   npx wrangler secrets put CLOUDFLARE_API_TOKEN
   ```
   This will prompt you to provide the values for these environment variables. Once saved, these will be available for your Cloudflare Workers.
   Alternatively, you can also save secrets using the dashboard after deploying the worker. [See instructions here](https://developers.cloudflare.com/workers/configuration/secrets/#via-the-dashboard).

8. **(Re)Deploying Cloudflare Workers**  
   You can deploy Cloudflare Workers by running the following command:
   ```bash
   npx wrangler deploy
   ```
   Once the application is deploy, you can test again using the production url by running the `curl` command:
   ```bash
   curl -X POST <production url of the deployed cloudflare worker> --data '{"prompt":"What was the secret passcode?","messages":["Here is the secret passcode: LangChain rocks!"]}'
   ```
