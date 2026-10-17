# MakerWorld to Drive (team version)

A small web app for the HoneyComb 3D team. Give it a MakerWorld model and it saves everything into one
shared Google Drive folder:

- title, designer, licence and description;
- **print profiles** with filament grams and print time, and a **price** worked out from your costs;
- the **designer's photos** and **community prints** (photos people posted in the comments);
- **your own photos** from a phone or computer;
- then, if you like, **AI versions** of any photo (new background, colour or finish) made with Gemini
  ("Nano Banana").

It works on Windows computers, Android phones and Android tablets, and everyone signs in with their own
Google account. Everything lands in **HoneyComb / MakerWorld imports** in the owner's Drive:

- `<model title> (<model id>) - <date> /` with `Designer photos/`, `Community prints/`, `Own photos/`,
  `AI edited/` and `model.json` (all details, print data, price breakdown, who saved it);
- one row per model in the **MakerWorld imports log** sheet: who saved it, filament grams, print time,
  suggested price, your price, a licence check and a Status column for the team to fill in.

Nothing goes through Claude. The app runs in Google Apps Script under each person's own account.

---

## Owner setup (once, on a computer, about 10 minutes)

The shared folder already exists: [HoneyComb / MakerWorld imports](https://drive.google.com/drive/folders/1qGplQuyLmQIW_yI9TRlxS68jwYdYSqtI).
`Code.gs` already points to it.

1. **Create the project.** Go to <https://script.google.com>, signed in as isurusandaruwan026418@gmail.com,
   click **New project** and name it `MakerWorld to Drive`.
2. **Paste the code.**
   - Replace everything in `Code.gs` with this folder's `Code.gs`.
   - Click **+** next to Files, choose **HTML**, name it `Page` and paste this folder's `Page.html`.
   - Press **Save** (Ctrl+S).
3. **Run setup once.**
   - In the toolbar, pick `setup` from the function list and press **Run**.
   - Google asks for permission. Press **Review permissions**, choose your account, then
     **Advanced → Go to MakerWorld to Drive (unsafe)** → **Allow**. This warning is normal for your own
     scripts.
   - The log shows the folder and the new **MakerWorld imports log** sheet.
4. **Project settings** (gear icon on the left):
   - **Time zone:** (GMT+05:30) Colombo.
   - **Script properties → Add script property:**
     - `GEMINI_API_KEY`: your key from <https://aistudio.google.com/apikey>, for the AI step. Image
       generation is billed per image to that Google account, so check Google's current pricing. Team
       members use it through the app but never see it.
     - `PRICING_EDITORS` (optional): emails, separated by commas, of anyone besides you who may change
       the pricing settings.
     - `GEMINI_MODEL` (optional): another image model. The default is `gemini-2.5-flash-image`.
5. **Deploy.** Click **Deploy → New deployment**, then the gear → **Web app**:
   - Execute as: **User accessing the web app**
   - Who has access: **Anyone with Google account**
   - Press **Deploy** and **copy the Web app URL**. It ends in `/exec`.

   Only people you share the folder with can save anything. Anyone else who opens the link sees
   "You don't have access" and can't save or use the AI step.
6. **Share the folder with the team.** In Drive, right-click **MakerWorld imports → Share** and add each
   person's Google account as **Editor**. Or send Claude their Gmail addresses and it will do it.
7. **Set your pricing.** Open the Web app URL, paste any model link, open **Pricing settings**, enter your
   real costs and press **Save pricing settings**. The first values are only examples. Only you (and
   `PRICING_EDITORS`) can save them; everyone else's price uses yours.
8. **Send the team the Web app URL** and the "Team guide" below. For the Windows bookmark, send Claude the
   URL and it will give you the finished bookmark line. Or put the URL in place of
   `PASTE_YOUR_WEB_APP_URL_HERE` in `bookmark-link.txt` yourself.

Optional: under Project settings, tick **Show "appsscript.json" manifest file in editor** and paste this
folder's `appsscript.json`. It records the same settings as steps 4 and 5.

**Updating the app** after a code change: paste the new code, then **Deploy → Manage deployments →
edit (pencil) → Version: New version → Deploy**. The URL stays the same.

---

## Team guide

### First time (everyone, any device)

1. Open the link the owner sent, signed in with the Google account the folder was shared with.
2. Google asks for permission once. Press **Review permissions**, choose your account, then
   **Advanced → Go to MakerWorld to Drive (unsafe)** → **Allow**. The app saves photos to the shared
   folder as you, and the log records your name.
3. At the top you should see **Signed in as you@…** and a **Shared folder** link. If you see
   "You don't have access", ask the owner to share the folder with that account.

If you are signed in to more than one Google account in the same browser, Google sometimes picks the
wrong one and the app shows an error. Use a window where you're signed in only to the shared account,
for example an incognito window or your own Chrome profile.

### Android phone or tablet

1. **Put the app on your home screen.** Open the link in Chrome, tap **⋮ → Add to Home screen**.
2. In the MakerWorld app or website, open the model, tap **Share → Copy link**.
3. Open **MakerWorld to Drive**, paste the link and tap **Get model**.
4. Check the details and photos. Grams, hours and the price come from the print profile. Untick photos you
   don't want, add your own print photos with **Add photos…**, and tick the licence box if the licence
   allows selling.
5. Tap **Save to Drive**.

If it says **"MakerWorld did not let Google's server read this page"**, MakerWorld blocked the
automatic read. Tap **Fill in by hand**:

- in MakerWorld, long-press each photo you want and tap **Download image**;
- back in the app, choose **Designer photos** or **Community prints** next to **Add photos…** and pick the
  downloaded photos;
- type the grams and print time from the model's print profile, then **Save to Drive**.

### Windows computer

Either use the same paste-a-link page as on Android, or add the one-click bookmark. The bookmark reads the
page in your own browser, so it also gets the community photos and print profiles that load while you
scroll.

1. Show the bookmarks bar: **Ctrl+Shift+B**.
2. Right-click the bar → **Add page** (Chrome) or **Add favourite** (Edge). Name it
   `Save to HoneyComb Drive` and paste the bookmark line from the owner as the URL.
3. On a MakerWorld model page, scroll through the photos, open the print profile list and scroll the
   comments / prints section (press "load more" for more photos). Then click the bookmark.
4. A new tab opens with everything found. Check it and press **Save to Drive**. If nothing opens, allow
   pop-ups for makerworld.com.

### AI versions

After saving, or later from **Recent imports → AI versions** on the start page:

1. Pick up to 6 photos per run.
2. Pick a preset (Studio, Wooden desk, Home shelf, Outdoors, New colour, Silk finish, Marble finish) or
   write your own instructions. For a colour, change "red" or "gold" in the text.
3. Press **Make AI versions**. Each photo takes about 10–20 seconds, and results land in `AI edited/` in
   that model's folder.

---

## Notes

- **Licences.** A MakerWorld commercial licence usually covers selling prints. It does not
  automatically let you use the designer's photos. Check each designer's terms before putting their photos,
  or edits of them, on the website. The log's licence column is the reminder.
- **Community photos** belong to the people who posted them. Use them as reference and as input for your
  own AI edits. On the website each product keeps at least one real photo of your own print, and
  AI-edited images are labelled (for example "Colour preview").
- **Tested on mock pages only.** Claude's environment can't reach makerworld.com, so the app was tested
  with copies of the page formats MakerWorld uses, not the live site. If something comes out wrong on a
  real model, fix the fields by hand before saving and tell Claude what you saw.
- Files: `Code.gs` (server), `Page.html` (the app page), `appsscript.json` (optional manifest),
  `bookmarklet.js` (readable bookmark source) and `bookmark-link.txt` (the same code as one bookmark line).
