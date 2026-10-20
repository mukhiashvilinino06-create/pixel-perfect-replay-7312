<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- UI text lives in the `src/lib/i18n.tsx` dictionary (ka/en); never hardcode user-visible strings — keeps both languages complete.
- Itineraries come from the local rules engine in `src/lib/planner.ts` (tested in `planner.test.ts`); results must stay labeled as demo unless a real AI model is wired in.
