# Influencer-AI

A cutting-edge platform designed to streamline and automate influencer marketing using the power of Artificial Intelligence. This project helps brands discover relevant influencers, manage campaigns, automate outreach, and track performance.

## Key Features

* **Brand & Campaign Management:** Easily create and manage your brand profile and marketing campaigns.
* **AI-Assisted Influencer Discovery:** Find the perfect influencers for your campaigns using smart filters and AI-powered matching (conceptual).
* **Automated AI Outreach:** Leverage AI (GPT-4o, ElevenLabs for voice) to handle initial outreach via email, (mocked) voice calls, and chat.
* **Outreach & Deal Tracking:** Monitor the progress of each outreach in real-time, from initial contact to deal finalization.
* **E-Signature Integration (Conceptual):** Streamline contract management with (mocked) DocuSign integration.
* **Payment Processing (Conceptual):** Manage influencer payments through (mocked) Razorpay integration.
* **Analytics Dashboard:** Gain insights into your campaign performance and outreach effectiveness.

## Tech Stack

* **Frontend:** Next.js, React, Tailwind CSS, ShadCN UI
* **Backend & Database:** Supabase (PostgreSQL, Auth, Storage)
* **AI/ML (Conceptual Integration):**
    * OpenAI GPT-4o (Outreach drafting, negotiation assistance, content summarization)
    * ElevenLabs (Voice synthesis for AI calls)
    * Whisper (Speech-to-text for call transcripts)
* **Key Third-Party APIs (Conceptual Integration):**
    * Gmail API (Email outreach)
    * DocuSign API (E-Signatures)
    * Razorpay API (Payments)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v18 or later recommended)
* npm, yarn, or pnpm
* A Supabase account and project set up.

### Installation

1.  **Clone the repo:**
    ```sh
    git clone [https://your-repo-url.git](https://your-repo-url.git)
    cd influencer-ai
    ```
2.  **Install NPM packages:**
    ```sh
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```
3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root of your project and add your Supabase project URL and anon key:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    # Add any other API keys here for local development (BE MINDFUL OF SECURITY FOR PRODUCTION)
    ```
4.  **Run the Supabase schema:**
    Ensure your Supabase database has the required tables. You can use the SQL scripts provided previously to set up the schema.

5.  **Run the development server:**
    ```sh
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

