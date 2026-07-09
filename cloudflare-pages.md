Cloudflare Pages deployment notes

Recommended configuration:

- Framework: Static site (React + Vite)
- Build command: npm run build
- Build output directory: web/dist

Steps:
1. Create a Git repository and push the project to GitHub/GitLab/Bitbucket.
2. In Cloudflare dashboard, go to Pages > Create a project and connect the repository.
3. Set the build command and publish directory above.
4. Provision any environment variables needed (none for the current static MVP).
5. Deploy. The published site will serve the static files from web/dist.

Optional: Use Cloudflare Pages Functions for server-side template generation or dynamic image generation. For now the app generates ZIPs client-side and produces static output suitable for Pages.
