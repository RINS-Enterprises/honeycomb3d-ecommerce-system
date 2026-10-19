# Order replies: copy-paste templates

For replying when an order request arrives from honeycomb3d.store. Save each one as a **quick reply** (`whatsapp-business.md` §6).

## How an order arrives

When a customer taps **Order now** or sends their request cart, WhatsApp opens with a message like this:

```
Hello HoneyComb 3D, I would like to request an order.
- Kurama Figure [HC-KURAMA] x 1: LKR 1,500
Estimated items subtotal: LKR 1,500
Please confirm availability, options, delivery cost, final total and payment arrangements. This is an order request, not a confirmed purchase.
```

The prices in it come from the website. Label the chat **New order**, then use the replies below in order.

## Placeholders

Anything in `{curly brackets}` must be filled in **before you send**. Some are filled per order; others **aren't decided yet** and stay blank until you choose (Session C is researching them):

| Placeholder | Filled from | Decided? |
|---|---|---|
| `{name}` | the customer's name | per order |
| `{items}` | the lines from their order message | per order |
| `{product}` | the design name, e.g. Kurama Figure | per order |
| `{colour}`, `{size}` | what you agree in the chat | per order |
| `{items_total}` | the subtotal from their order message (website prices) | per order |
| `{ready_by}` | when you expect it printed and finished | per order |
| `{delivery_fee}` | your delivery charge | **not decided yet** |
| `{delivery_time}` | usual days from dispatch to arrival | **not decided yet** |
| `{total}` | `{items_total}` + `{delivery_fee}` | per order, once the fee is decided |
| `{payment_method}` | e.g. bank transfer / cash on delivery | **not decided yet** |
| `{bank_details}` | account name, bank, branch, account number | **not decided yet** (never post these publicly) |
| `{courier}`, `{tracking}` | from the courier receipt | per order |
| `{review_link}` | your Google review link | after the Google profile exists |

**Never send a message that still has `{...}` in it.** Never promise a date you're not sure of. In Sinhala replies, write times the Sinhala way (e.g. `දවස් 2–3`). The Sinhala templates were checked by a Sinhala reviewer.

---

## 1. Confirm the design and colour (`/confirm`)

**English**
```
Hi {name}, thank you for your order request 🐝
You asked for:
{items}
Before we print, please confirm:
• Colour: {colour}
• Size: {size}
Any other details (a name, a keyring, a gift)? Just tell us here.
```

**Sinhala**
```
Hi {name}, ඕඩර් request එකට ස්තුතියි 🐝
ඔයා ඉල්ලපු දේ:
{items}
Print කරන්න කලින් මේවා confirm කරන්න:
• Colour: {colour}
• Size: {size}
වෙන මොනවා හරි details (නමක්, keyring එකක්, gift එකක් වගේ) තියෙනවා නම් මෙතන කියන්න.
```

## 2. The total (`/total`)

**English**
```
Here's your total, {name}:
{items}
Items: {items_total}
Delivery: {delivery_fee}
Total: {total}
We can have it printed and finished by {ready_by}. Delivery usually takes {delivery_time} after that.
Shall we go ahead? Reply YES and we'll start.
```

**Sinhala**
```
{name}, මෙන්න ඔයාගේ total එක:
{items}
Items: {items_total}
Delivery: {delivery_fee}
Total: {total}
{ready_by} වෙද්දි print කරලා ඉවර කරන්න පුළුවන්. ඊට පස්සේ delivery එකට සාමාන්‍යයෙන් {delivery_time} යනවා.
අපි පටන් ගමුද? YES කියලා reply කරන්න, අපි වැඩේ පටන් ගන්නම්.
```

## 3. Ask for the delivery address (`/address`)

**English**
```
Great, thank you! Please send:
• Full name
• Delivery address (with the nearest town)
• A phone number for the courier
```

**Sinhala**
```
ගොඩක් ස්තුතියි! කරුණාකරලා මේවා එවන්න:
• සම්පූර්ණ නම
• Delivery address එක (ළඟම නගරයත් එක්ක)
• Courier එකෙන් call කරන්න පුළුවන් phone number එකක්
```

## 4. Payment instructions (`/pay`)

⚠️ **Don't use this until you've decided `{payment_method}` and filled in `{bank_details}`.** Until then, agree payment in the chat as you do now.

**English**
```
Payment: {payment_method}
{bank_details}
Amount: {total}
Please send a photo of the receipt here once it's done, and we'll start printing.
```

**Sinhala**
```
Payment: {payment_method}
{bank_details}
ගෙවන්න ඕන ගාණ: {total}
ගෙවලා ඉවර වුණාම receipt එකේ photo එකක් මෙතනට එවන්න. එතකොට අපි print කරන්න පටන් ගන්නම්.
```

## 5. Order dispatched (`/sent`)

**English**
```
Good news, {name}! Your order is on its way 📦
Courier: {courier}
Tracking: {tracking}
It usually arrives in {delivery_time}. Let us know when it reaches you!
```

**Sinhala**
```
Good news {name}! ඔයාගේ ඕඩර් එක එව්වා 📦
Courier: {courier}
Tracking: {tracking}
සාමාන්‍යයෙන් ලැබෙන්න {delivery_time} විතර යනවා. ලැබුණාම අපිට කියන්න!
```

## 6. Thank you + review request (`/thanks`)

Send 3–7 days after it arrives. Before your Google profile exists, use `reviews.md` version A instead (no link).

**English**
```
Hi {name}, I hope you're enjoying your {product} 🐝 Thank you for ordering from HoneyComb 3D!
If you have a minute, an honest Google review really helps a small studio like ours:
{review_link}
And if you'd like, send us a photo of it in its new home. With your OK, we'd love to share it on Instagram (first name only, or no name).
```

**Sinhala**
```
Hi {name}, ඔයා {product} එකට කැමති ඇති කියලා හිතනවා 🐝 HoneyComb 3D එකෙන් ඕඩර් කළාට ස්තුතියි!
පොඩි වෙලාවක් තියෙනවා නම්, ඔයාගේ ඇත්ත අදහස Google review එකක් විදියට දැම්මොත් අපි වගේ පොඩි studio එකකට ඒක ලොකු උදව්වක් වෙනවා:
{review_link}
කැමති නම් ඒක තියලා තියෙන තැන photo එකකුත් එවන්න. ඔයාට OK නම් ඒක අපේ Instagram එකේ share කරන්න අපි ගොඩක් කැමතියි (මුල් නම විතරයි, නැත්නම් නමක් නැතුව).
```

## 7. Custom request (`/custom`)

**English**
```
Thanks for the idea, {name}! Could you send a link to the model (or a few photos) and the rough size you'd like?
We'll check whether we can print it well and come back to you with a quote.
```

**Sinhala**
```
Idea එකට ස්තුතියි {name}! Model එකේ link එකක් (නැත්නම් photos ටිකක්) සහ ඔයාට ඕන size එක ආසන්න වශයෙන් එවන්න පුළුවන්ද?
අපි ඒක හොඳට print කරන්න පුළුවන්ද කියලා බලලා quote එකක් එක්ක reply කරන්නම්.
```

---

## Rules

- Use the **website price** for each design. If you agree a different size that changes the price, say so clearly in the chat before the customer says YES.
- Don't say "in stock" or "ready now". Everything is printed to order.
- Don't promise a delivery date until `{delivery_time}` is decided, and even then say "usually".
- Only ever use **071 059 9815** for orders.
- Keep bank details in this private chat only, never on Instagram or the website.
