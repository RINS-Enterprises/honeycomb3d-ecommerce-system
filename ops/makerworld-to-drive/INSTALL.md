# Install MakerWorld to Drive (short version, about 10 minutes)

This is the short version of "Owner setup" in `README.md`. Do it once.

**A computer is easiest.** The Apps Script editor is hard to use on a phone. If you only have a phone,
open the links in Chrome and tap **⋮ → Desktop site**.

Use the Google account **isurusandaruwan026418@gmail.com** for every step.

1. **Open Apps Script.** Go to <https://script.google.com>, tap **New project**, and rename it
   `MakerWorld to Drive` (tap "Untitled project" at the top).
2. **Paste the server code.** Open `Code.gs` from this folder on GitHub (branch `claude/ops-automations`)
   and tap **Raw**. Select all and copy it. In Apps Script, delete everything in `Code.gs`, paste, and save
   (Ctrl+S or the disk icon).
3. **Add the page.** In Apps Script, tap **+** next to *Files*, then **HTML**, and name it `Page`. Do not type
   `.html`, Apps Script adds it. Copy `Page.html` from GitHub the same way, paste it over everything, and
   save.
4. **Set the time zone.** Tap the gear (**Project settings**) and set *Time zone* to **(GMT+05:30) Colombo**.
5. **Run setup once.** Back in the editor (`< >` icon), choose **setup** in the function list at the top and
   tap **Run**. Google asks for permission. Tap **Review permissions**, choose your account, then
   **Advanced → Go to MakerWorld to Drive (unsafe) → Allow**. You see this warning because it's your own
   script. The log should say *Shared folder: …* and *Log sheet: …*.
6. **Deploy.** Tap **Deploy → New deployment**, then the gear next to *Select type*, then **Web app**.
   Set:
   - *Execute as*: **User accessing the web app**
   - *Who has access*: **Anyone with Google account**

   Tap **Deploy**, then **copy the Web app URL**. It ends in `/exec`.
7. **Send the URL to Claude** in the Ops & Automations session. Claude sends back your one-click bookmark
   line for Windows.
8. **Open the URL yourself.** Allow permissions again if asked. At the top you should see
   *Signed in as isurusandaruwan026418@gmail.com* and a *Shared folder* link.
9. **Set your real costs.** Paste any MakerWorld model link and tap **Get model** (or **Fill in by hand**
   if it can't read the page). Then open **Pricing settings**, enter your own costs, and tap
   **Save pricing settings**. The numbers already there are only examples.

**Leave out for now:** `GEMINI_API_KEY`. Without it, the "AI versions" button stays off. Gemini image
generation is billed per image, so add the key only when you decide to pay for it.

## If something goes wrong

| You see | Do this |
|---|---|
| "The tool is not set up yet" | Run step 5 again (the message calls it "README step 3"). |
| "You don't have access" | You're signed in to a different Google account. Use an incognito window signed in only to the account above. |
| An error page after several accounts are signed in | Same fix: use one account only. |
| Changed code later | **Deploy → Manage deployments → pencil → Version: New version → Deploy**. The URL stays the same. |
