# Jake Kang

CS and econ student at Northeastern Khoury College of Computer Science.

[jakekang.me](https://jakekang.vercel.app) · [github.com/echoo19](https://github.com/echoo19) · [LinkedIn](https://www.linkedin.com/in/hyunsoo-kang-44370b329/)

---

## Lectern

A productized agency that builds and runs the software academies use to operate: student profiles, attendance, practice tests, question banks, TA scheduling and payroll, and the parent reports that actually sell the thing. Every academy runs on one shared codebase and gets configured rather than rebuilt, so the fifth customer costs far less to onboard than the second. AI does the building behind the curtain; the academy just buys a system that runs their operation.

The first academy is live in production. What's running today: a Bluebook-style SAT test player with auto-grading and resumable timed sections, adaptive question-bank and vocabulary practice, TA shifts with clock-in and payroll, PDF report cards for parents, and a pipeline that takes an uploaded test PDF and turns it into a verified question bank by having GPT 5.5 and Opus 4.8 extract it separately and reconcile the two. New leads come in through a public intake funnel.

Live at [lectern.systems](https://lectern.systems).

## Hearth

A 2D game engine and editor for humans and coding agents to build games together. You work in a visual editor; an agent works through the same 48 CLI commands and an MCP server. Both go through the exact same engine operations to create entities, attach scripts, run a headless playtest, or manage assets, so neither side can do anything the other can't see or undo. Projects stay on your disk as plain JSON, Lua and JavaScript, and asset files, so nothing gets trapped inside the tool.

Currently at v1.2 and receiving active feedback, MIT licensed, with desktop builds for macOS, Windows, and Linux.

[github.com/echoo19/hearth](https://github.com/echoo19/hearth) · [hearthengine.com](https://hearthengine.com)

## Hive

An open catalog of things AI agents can use: MCP servers, CLIs, skills, subagents, plugins. You install the Hive MCP once and the agent takes it from there. It calls `discover(intent)` to find a tool by describing what it's trying to build, then `install(slug)` to set that tool up on its own, no copy-pasting config. Each tool publishes a plain-text `install.md` the agent reads directly. Runs on Supabase, deploys on Vercel, published as [`@echoo19/hive-mcp`](https://www.npmjs.com/package/@echoo19/hive-mcp) on npm.

I've also put out a few agent plugins: Decision Simulator for weighing tradeoffs, Feature Agents for pressure-testing a feature before it gets built, and ArchKit for keeping a codebase's structure navigable.

[github.com/echoo19/hive-mcp](https://github.com/echoo19/hive-mcp) · [hive-tooling.vercel.app](https://hive-tooling.vercel.app)


## What I work with

The languages I reach for most are Python, TypeScript, and Java, with C++, C#, and Lua when a project calls for them. On the web that's usually React, Next.js, and Tailwind; on the backend, Supabase and Postgres with the Google OAuth APIs. For AI work I've trained models with PyTorch and scikit-learn and built the agent side of things: LLM APIs from Anthropic and OpenAI, function calling and structured output, MCP servers and plugins, RAG with embeddings, and multi-agent setups. The hardware projects keep me in Raspberry Pi, ESP32-S3, and edge inference, wiring cameras and sensors on breadboards.

The work also pulls me into non-technical roles, notably the agency-to-product strategy behind Lectern, the market research and cold outreach that find the next academy, and enough writing to turn a messy problem into an operating model clear enough to hand off to a person or an agent.

## What I'm interested in

AI that goes a step past agentic harnesses: it molds the software itself to fit each person and business. Everyone interacts with their tech differently, and AI is the key to software that's actually dynamic.

[github.com/echoo19](https://github.com/echoo19) · [linkedin.com/in/hyunsoo-kang](https://www.linkedin.com/in/hyunsoo-kang-44370b329/)
