# Website asset provenance

Imported and verified 13 October 2026. The owner approved the real-photo choices on 11 October 2026.
Drive originals were SHA-256 checked against Claude's qa/asset-recommendations.json before import.
Camera, timestamp, GPS and text metadata were removed from the source containers without changing their compressed image pixels. Rendering colour profiles are retained only in the source files. Original EXIF orientation is recorded below and applied before cropping.
Source inputs stay under assets/photo-sources/, outside public/ and dist/. The build copies only the catalog's referenced derivatives.
Outputs use Lanczos resizing, sRGB, WebP (quality shown below) or PNG for the logo. EXIF, XMP and ICC metadata are stripped from every output. No artwork was generated, retouched or reconstructed.
All dimensions and crops use pixels; crop boxes are (left, top, right, bottom), with exclusive right/bottom edges. Width and height attributes use the fallback derivative's actual dimensions.
Reproduce with python -m pip install Pillow==11.3.0 and python scripts/prepare-images.py. assets/image-sources.json stores the input hashes and crop specifications; assets/derivatives.json stores machine-readable output hashes.

## HC-LEAF

- Source title: `Copy of RAV_4459.jpg`
- Source Drive ID: `1rW98jCTB1kwWoP0gMThUrnWitqN8-q_v`
- Drive original SHA-256: `d1f9cb985d101fde84d3decfb82c3b9ae8f90f67a2c82db03606b214ccef9b04`
- Metadata-clean source input: `assets/photo-sources/hidden-leaf.jpg`
- Input SHA-256: `6550f9d1c2a03ffedba857715ddfb9cbb55d3c2c5f566d789dde966b94b9145e`
- Source dimensions: 4299 × 6442; EXIF orientation 1.
- Applied crop box after orientation: `(1250, 1660, 3000, 2430)`.
- Square storefront frame: the whole applied crop centred on a 1750 × 1750 square whose padding repeats the crop edge tones outward (averaged per row or column and smoothed; median backdrop `#d8d2d2`), with a 70 px edge fade. Shows the whole plate, keyring loop to right end.
- Product-page gallery image 2 (inside the applied crop): `(1640, 1660, 2410, 2430)`. Detail: Centres the Hidden Leaf emblem and the plate's left rivets; the approved crop is too shallow for a square of the whole plate.
- Product-page gallery image 3 (inside the applied crop): `(1250, 1660, 2020, 2430)`. Keyring loop and rivets.
- Link-preview image: the square storefront frame at 1200 × 1200, baseline JPEG without metadata.

The crop selects only the upper Hidden Leaf headband plate, including its keyring loop and shadow; the other three village plates are outside the crop.

| Output | Resize width | Actual dimensions | Bytes | Quality | Output SHA-256 |
|---|---:|---|---:|---:|---|
| `/assets/hidden-leaf-480.webp` | 480 | 480 × 211 | 9786 | 82 | `a11f9205ab677bf93b12e72f75b823b9ce0d2f9254d04badbeb2cefbad6f5bda` |
| `/assets/hidden-leaf-960.webp` | 960 | 960 × 422 | 38452 | 82 | `784dbe7234ac62af94f162c336a0031c7ec5eac014b8da942a3de8fcf6fc3614` |
| `/assets/hidden-leaf-1440.webp` | 1440 | 1440 × 634 | 79138 | 82 | `437caad3c0dfffb60dd8daf0d6e47384893ed3dd566993e1e513aef72a559723` |
| `/assets/hidden-leaf-sq-160.webp` | 160 | 160 × 160 | 1588 | 82 | `1b9837f5db14a61744c5d00033d0db4261a3439ddba309c83ecf896efc877d3b` |
| `/assets/hidden-leaf-sq-320.webp` | 320 | 320 × 320 | 4058 | 82 | `6024c57c0cf3f6474aac33a43bbd586728aa84aecd69f51fb139303f63cfd2d3` |
| `/assets/hidden-leaf-sq-480.webp` | 480 | 480 × 480 | 8856 | 82 | `740fffa937980fa4a95a82c7cc14d18399489ffa2e387cf2cb000fa09a3d0a31` |
| `/assets/hidden-leaf-sq-640.webp` | 640 | 640 × 640 | 14940 | 82 | `3594a05a5eda66538f3ee2e13f6f799a57e43c3ad86d2dbcc6e0d68de4aab08a` |
| `/assets/hidden-leaf-sq-960.webp` | 960 | 960 × 960 | 33236 | 82 | `a2e68f492685f9a9eee982d9f23353e453129dd21b26a285bebb9cf56e9c264c` |
| `/assets/hidden-leaf-sq-1200.webp` | 1200 | 1200 × 1200 | 50574 | 82 | `2c22b301c50fc22ab921459c675ae5f2c3b76a135e75f889e6819c4f6129b8a1` |
| `/assets/hidden-leaf-g2-160.webp` | 160 | 160 × 160 | 3232 | 82 | `91acf2bcb1bb145be559d35d1cb1fdc10a20eb483732382dc7339673956a669f` |
| `/assets/hidden-leaf-g2-320.webp` | 320 | 320 × 320 | 11288 | 82 | `78c3a6223f8f6368e2ea1fc156b757c480790cb1f8f619d040b00069c2962013` |
| `/assets/hidden-leaf-g2-480.webp` | 480 | 480 × 480 | 23952 | 82 | `2d664b89e3be87c9329bc767e7a3544b1ea8e4873a760bf5941a467510ed165a` |
| `/assets/hidden-leaf-g2-640.webp` | 640 | 640 × 640 | 38990 | 82 | `5a8fe30feb0456d7b9dc4a84c8606943f3a3f3af9caada2d2da8c7a493ab67b6` |
| `/assets/hidden-leaf-g2-770.webp` | 770 | 770 × 770 | 55564 | 82 | `8fd28d63e926265af6186da05196e6162ebb2ce70fc066b2d92e8448a08618c4` |
| `/assets/hidden-leaf-g3-160.webp` | 160 | 160 × 160 | 2222 | 82 | `07c9648bd99f42373ad1f30392d824c4ede189e78b3e60562d7d051fa000fdac` |
| `/assets/hidden-leaf-g3-320.webp` | 320 | 320 × 320 | 8846 | 82 | `ffcdbcd1e0a60f764e72e2e1a5876773c921f3364a6032324417bff3e9de156a` |
| `/assets/hidden-leaf-g3-480.webp` | 480 | 480 × 480 | 20920 | 82 | `f2acd171b23fb158dbe96c6c20e718e34763ad16190f3f331786b0cfa48eea99` |
| `/assets/hidden-leaf-g3-640.webp` | 640 | 640 × 640 | 35736 | 82 | `16913d3621c7ea263ad7ebf57326e5bee374dc7a8b53c9b953c8d0d15713e9a5` |
| `/assets/hidden-leaf-g3-770.webp` | 770 | 770 × 770 | 51844 | 82 | `5eb860918aa32d0325f6d90cb4f87da7715135d3b4781c47b311744272c96cbe` |
| `/assets/hidden-leaf-share.jpg` | 1200 | 1200 × 1200 | 109561 | JPEG 84 | `4ca91333d306d0ef63c26d7f60074ba6e8b22ff3c5e29e6e41cacb678ba72d76` |

## HC-BAYMAX

- Source title: `HNYCMB504 (1).png`
- Source Drive ID: `1XGpES0PDcZuXp46hSPsD_gtHMsP_qVbY`
- Drive original SHA-256: `d9c9b702a5af80a9019a2224dbd5e102e4f0afd4fef9cab4948e471ea0efcdb5`
- Metadata-clean source input: `assets/photo-sources/baymax.png`
- Input SHA-256: `2caef48ac4bbcbcc586df925b59e77a4f1c706ca07b51d0d9061aa8babe4bc7e`
- Source dimensions: 1536 × 2048; EXIF orientation 1.
- Applied crop box after orientation: `(0, 0, 1536, 2048)`.
- Square storefront frame (inside the applied crop): `(0, 400, 1536, 1936)`. Keeps both figures; trims the empty wall above and part of the grass below.
- Link-preview image: the square storefront frame at 1200 × 1200, baseline JPEG without metadata.

| Output | Resize width | Actual dimensions | Bytes | Quality | Output SHA-256 |
|---|---:|---|---:|---:|---|
| `/assets/baymax-480.webp` | 480 | 480 × 640 | 28300 | 82 | `250873e25a2a5060e8b62bf90093cd3ad84356ea5f2f96800995e0e9c2354d93` |
| `/assets/baymax-960.webp` | 960 | 960 × 1280 | 91622 | 82 | `72e907f1342fbb8e4e489114a48109874a0b19c36071d5643a3250c21565106f` |
| `/assets/baymax-1440.webp` | 1440 | 1440 × 1920 | 174868 | 82 | `0c76fede0f9678fda981bf49026d6c25f688df3954f19cbe5676a83fdc520dcf` |
| `/assets/baymax-sq-160.webp` | 160 | 160 × 160 | 3646 | 82 | `c3b6bdc9d754a89a5e0e836c4cd8c97afe620f1506277f2ed51c871219f22dd6` |
| `/assets/baymax-sq-320.webp` | 320 | 320 × 320 | 12108 | 82 | `9ebe7175b33bb183cf2afc137a92666af033f4e2d33b3619948ec55419d9c2da` |
| `/assets/baymax-sq-480.webp` | 480 | 480 × 480 | 25188 | 82 | `f56dcd5a8939ad3b8774b52074adce0fb3deed97615a0938f5c596ea88f290af` |
| `/assets/baymax-sq-640.webp` | 640 | 640 × 640 | 41458 | 82 | `856ec11c7318be0a618482c94d0bafd0c5aa3a9bfe4c3f5c0550b3d6fc738101` |
| `/assets/baymax-sq-960.webp` | 960 | 960 × 960 | 82492 | 82 | `42e3d86e2a3f4e947119e5a955831adb5c702474ee0a229dd3cd7a469a56523c` |
| `/assets/baymax-sq-1200.webp` | 1200 | 1200 × 1200 | 119270 | 82 | `52b777d3455d694898a299b4f5440e97f9af86729a689e19f02e2c42d2968182` |
| `/assets/baymax-share.jpg` | 1200 | 1200 × 1200 | 193534 | JPEG 84 | `4c974fe51963ac1d4df374c14ec0a06cc0f104a19a14295c7a2ec4a8768d636b` |

## HNYCMB501

- Source title: `20260301_152139.jpg`
- Source Drive ID: `1w5Ulskt4b-WEdJkQLXcR52s3YucH5Rfg`
- Drive original SHA-256: `408785f66536cca48db02286bdc9fdc50a3e246e4d69a6cd7f1343329f87807b`
- Metadata-clean source input: `assets/photo-sources/night-fury.jpg`
- Input SHA-256: `775dddb36cf5d98a07ce92ba4a1ddad26c0e27bd7868c55bfe5822b447b04959`
- Source dimensions: 1893 × 1420; EXIF orientation 1.
- Applied crop box after orientation: `(0, 0, 1893, 1420)`.
- Square storefront frame (inside the applied crop): `(236, 0, 1656, 1420)`. Centres the figure and the holding hand.
- Home and shop link-preview frame (inside the applied crop): `(0, 176, 1893, 1170)`, 1200 × 630 JPEG.
- Link-preview image: the square storefront frame at 1200 × 1200, baseline JPEG without metadata.
- Home hero landscape frame (inside the applied crop): `(0, 200, 1893, 1146)`. 2:1 desktop hero; the dragon sits just right of centre so the headline can sit on the darkened left.
- Home hero portrait frame (inside the applied crop): `(480, 0, 1545, 1420)`. 3:4 mobile hero; head, wings and tail.

| Output | Resize width | Actual dimensions | Bytes | Quality | Output SHA-256 |
|---|---:|---|---:|---:|---|
| `/assets/night-fury-480.webp` | 480 | 480 × 360 | 14324 | 82 | `7e480852833cecbdf57660165d7a6a3ad44296980114f566f72db051f6c0a9d8` |
| `/assets/night-fury-960.webp` | 960 | 960 × 720 | 37432 | 82 | `2071959e347554061056f0c997e4834b37519adb10c4b609ccfce9bf7867bb70` |
| `/assets/night-fury-1440.webp` | 1440 | 1440 × 1080 | 65288 | 82 | `e1f5abdffb91b9542ea26845ca57a53a66980d2cf97773b9c271005110b16dbe` |
| `/assets/night-fury-sq-160.webp` | 160 | 160 × 160 | 4416 | 82 | `e4da14a88a0cd445ab1ea6c7fbe12a8d4f11536d791a9a56ba634ee304731b97` |
| `/assets/night-fury-sq-320.webp` | 320 | 320 × 320 | 11300 | 82 | `f171e0233af66fa4448ac12c995de1173c9e59a748abdc1688bbbba220fc83d2` |
| `/assets/night-fury-sq-480.webp` | 480 | 480 × 480 | 19770 | 82 | `5f0288b1bacd43f6efdc84a5606cb40366559faf6dae6e9f5759ec8b43e17d6b` |
| `/assets/night-fury-sq-640.webp` | 640 | 640 × 640 | 29256 | 82 | `9530e86ee2856af28560674109f61c0f6d0e54e4b9416b59de1fdba83e4a7601` |
| `/assets/night-fury-sq-960.webp` | 960 | 960 × 960 | 50340 | 82 | `dea3be4fd9c0f8ddb9cfd7e517409b1eaf87445139d58e9b29929c7315006402` |
| `/assets/night-fury-sq-1200.webp` | 1200 | 1200 × 1200 | 68408 | 82 | `0c473534c6a8db00444e6f31895d7745426a96b77f835e45aab51305a15def78` |
| `/assets/night-fury-hero-landscape-960.webp` | 960 | 960 × 480 | 32056 | 82 | `8f911c242137d4587e5928f3c77e6c871291c1a26a673484e84efa4ad6a87d6c` |
| `/assets/night-fury-hero-landscape-1280.webp` | 1280 | 1280 × 640 | 47668 | 82 | `fc51f086b2e7c3493f5434340e413acde1406e64a7b4a7ce5ce1887f72b924cd` |
| `/assets/night-fury-hero-landscape-1600.webp` | 1600 | 1600 × 800 | 64520 | 82 | `882cb4c4b2db25952fb9437d672aa9e02cfad58c39ef4d9f244f186b0fd1fee7` |
| `/assets/night-fury-hero-landscape-1893.webp` | 1893 | 1893 × 946 | 80530 | 82 | `048bef15e77ed7e3159e9789aee6e51316eb8e441028c61fcce78cd0b8f68596` |
| `/assets/night-fury-hero-portrait-480.webp` | 480 | 480 × 640 | 25756 | 82 | `6aa20a795e485be19d8183d2b7fb09bfd3aee9535f8e4199c31be9be2e592666` |
| `/assets/night-fury-hero-portrait-720.webp` | 720 | 720 × 960 | 45514 | 82 | `870734819b4708c1c26a2db7c8e9e427ffb693da6826b630eccef58b5126122a` |
| `/assets/night-fury-hero-portrait-960.webp` | 960 | 960 × 1280 | 68160 | 82 | `8bfe5b8bc444125d725952a43eee1b880ffa33167c4814d5251eb70447f2dee3` |
| `/assets/night-fury-hero-portrait-1065.webp` | 1065 | 1065 × 1420 | 74826 | 82 | `b717079dd6f830bc1b91141bf70d690b5983a33489769f12365134d233656788` |
| `/assets/night-fury-share.jpg` | 1200 | 1200 × 1200 | 144615 | JPEG 84 | `80651a466a29fc6120975a1bd28325894b8db07cc0031ffc52fe5ad71034367c` |
| `/assets/site-share.jpg` | 1200 | 1200 × 630 | 87696 | JPEG 84 | `5e911c76bd703b74ecc83912363e3e2f6eee17fadf0cc3b5c31bbc7ae626e058` |

## HC-MINATO

- Source title: `Copy of RAV_4468.jpg`
- Source Drive ID: `1saPgsNnYGHltaJeXCLFe4w5pL48P4v9F`
- Drive original SHA-256: `6bed862cf24b3c9522222aa839198a94326ff1ca06c98f3dd0a43f9f24b02028`
- Metadata-clean source input: `assets/photo-sources/minato-kunai.jpg`
- Input SHA-256: `4c9673b96abc990ab4505ef0f46e6f4050029e0ed0ee44ba21b681c47af77479`
- Source dimensions: 4912 × 7360; EXIF orientation 1.
- Applied crop box after orientation: `(2770, 2150, 4600, 6250)`.
- Square storefront frame: the whole applied crop centred on a 4100 × 4100 square whose padding repeats the crop edge tones outward (averaged per row or column and smoothed; median backdrop `#eae6e5`), with a 164 px edge fade. Shows the whole kunai, ring to blade tip, with a margin.
- Product-page gallery image 2 (inside the applied crop): `(2770, 2950, 4600, 4780)`. Detail: Shows the engraved handle and full wings; the ring and blade tip fall outside the square.
- Product-page gallery image 3 (inside the applied crop): `(2770, 2200, 4600, 4030)`. Ring and engraved grip.
- Product-page gallery image 4 (inside the applied crop): `(2770, 4320, 4600, 6150)`. Wings and blade to the tip.
- Link-preview image: the square storefront frame at 1200 × 1200, baseline JPEG without metadata.

The left edge is x=2770, within the required x=2756…2794 bounds. The crop isolates the tan engraved handle, black blade, silver edge bevels and black ring. The full crop is not widened to include the adjacent blade. Its square storefront frame is cut from inside this crop.

| Output | Resize width | Actual dimensions | Bytes | Quality | Output SHA-256 |
|---|---:|---|---:|---:|---|
| `/assets/minato-kunai-160.webp` | 160 | 160 × 358 | 3536 | 82 | `2ea7980f03aa5e465e3f9e07d64ae8c59a745b7c7f4324a9ab3744b4684cf83e` |
| `/assets/minato-kunai-240.webp` | 240 | 240 × 538 | 6474 | 82 | `7fd13d17c5885ef58d47711bf43b0e44457dcd07300459433d59d34e90c0820e` |
| `/assets/minato-kunai-480.webp` | 480 | 480 × 1075 | 20718 | 82 | `9880a18df2a171585733ea002c0dec08d1b319dd1a11d1d832020b3333617f79` |
| `/assets/minato-kunai-960.webp` | 960 | 960 × 2151 | 93218 | 82 | `3490f32cac68d84b5c6097e9f5a2af038298c2fcec41e090c367bb263ad259e4` |
| `/assets/minato-kunai-1440.webp` | 1440 | 1440 × 3226 | 251428 | 82 | `34d72359b337d2f5f14ef44c1c1e9754a98dc05d39530adfc70748aca137c1f2` |
| `/assets/minato-kunai-sq-160.webp` | 160 | 160 × 160 | 1228 | 82 | `6d81157b1f7ac4f3c5f93c06699c06b3e0fbcc3ef09b3855c043f4dbb7051ea9` |
| `/assets/minato-kunai-sq-320.webp` | 320 | 320 × 320 | 3034 | 82 | `4d28ec398615b8d0b6e730ffb8622bc41262b13be2d5106a70d43d2adee58baf` |
| `/assets/minato-kunai-sq-480.webp` | 480 | 480 × 480 | 5670 | 82 | `134c5a8faa657b729c15fac81379e04d1cf7de423a24c53b4a0683ff2c579c99` |
| `/assets/minato-kunai-sq-640.webp` | 640 | 640 × 640 | 9180 | 82 | `509436116d935f3ebda384389553adeb8c8861dbb82bd4b01f8392f14447f339` |
| `/assets/minato-kunai-sq-960.webp` | 960 | 960 × 960 | 18292 | 82 | `907103368b5858a42ef3847dd5919d26c578e8a81246aded3b938634ec9cfdaa` |
| `/assets/minato-kunai-sq-1200.webp` | 1200 | 1200 × 1200 | 27422 | 82 | `803302b86666e8d2f09c74c62f02fda8ba8482b8c6b0be3cc6007d82a3ff184a` |
| `/assets/minato-kunai-g2-160.webp` | 160 | 160 × 160 | 1866 | 82 | `9849929b329dfa1fd5d35a66973e4f4d0013dcadf491556378d60734a8999391` |
| `/assets/minato-kunai-g2-320.webp` | 320 | 320 × 320 | 5274 | 82 | `614914d378cbb2a606f1ff1bafcb00a14fa339bc6c6e1f69e89253fa6d676068` |
| `/assets/minato-kunai-g2-480.webp` | 480 | 480 × 480 | 9738 | 82 | `ad02a6ee4457279d6ef2d7644a89a8ed48652b6b9e487ec57ca37f6f20b747dc` |
| `/assets/minato-kunai-g2-640.webp` | 640 | 640 × 640 | 17036 | 82 | `4d5cc866b87e74da57559b11ac6c6e8de30ca662d8cc6d63d39c09b69b65b0e8` |
| `/assets/minato-kunai-g2-960.webp` | 960 | 960 × 960 | 47800 | 82 | `7ac893191b13968986c4d966f457cbbd2fae040b855992f096027e44cee55208` |
| `/assets/minato-kunai-g2-1200.webp` | 1200 | 1200 × 1200 | 88300 | 82 | `b5b4b6a21cc19b104c8af1b65d0e99d9750b1a24c1313ba62f25f019691f1fa3` |
| `/assets/minato-kunai-g3-160.webp` | 160 | 160 × 160 | 1806 | 82 | `973b6b187c6c4e53f7115335fecd99094217e5204798ab019fb4e9611cf0f75e` |
| `/assets/minato-kunai-g3-320.webp` | 320 | 320 × 320 | 5400 | 82 | `a35e7894af42b943041ad30cf51c5993d78283a1239e73ad359ea4603fb7ec13` |
| `/assets/minato-kunai-g3-480.webp` | 480 | 480 × 480 | 11544 | 82 | `2b368bbf33adb48db35d2143a1fe0ac3fb215e68860d6a7f9b77be5dc55de120` |
| `/assets/minato-kunai-g3-640.webp` | 640 | 640 × 640 | 20502 | 82 | `ca624aa352bd52e17c44b3070eba2a4708871a9d993583ed7249e1c56d7ed5b5` |
| `/assets/minato-kunai-g3-960.webp` | 960 | 960 × 960 | 50612 | 82 | `0ec76cfe59dd09869629a891b4bbcb8a82ac7fcdb180fed6e7253e71bc3d3f62` |
| `/assets/minato-kunai-g3-1200.webp` | 1200 | 1200 × 1200 | 84564 | 82 | `c8012b3bd0a2cd8a331325b8e36f0fc0641cbef3b137dc41ad8bf3a284a3ceea` |
| `/assets/minato-kunai-g4-160.webp` | 160 | 160 × 160 | 1438 | 82 | `76112521390187a4a64ddd45e7f118e3da32d47cd64c87f7ad24f83f2f9252ea` |
| `/assets/minato-kunai-g4-320.webp` | 320 | 320 × 320 | 4014 | 82 | `44bd2cf8fec2b9828a5af1817030cc86451943ccffd5c1bd2bf813673234ff42` |
| `/assets/minato-kunai-g4-480.webp` | 480 | 480 × 480 | 7766 | 82 | `8a87bd29b77d9d87b7b70353b841cf58dbf060846eab7000c46297e5b9b3b111` |
| `/assets/minato-kunai-g4-640.webp` | 640 | 640 × 640 | 13626 | 82 | `6db0cb17d88c0cf3337df6dc16562d1d2fae3bf7049e283eb86933e525016742` |
| `/assets/minato-kunai-g4-960.webp` | 960 | 960 × 960 | 35852 | 82 | `8b6cc1f54ab8103ce8841db455895ebf12abf62ea4ae81c023caf9026ee77d5a` |
| `/assets/minato-kunai-g4-1200.webp` | 1200 | 1200 × 1200 | 65284 | 82 | `4843e447aca750e4e4ed8e19bc09da5c11318dde882698f555c9b72b07ad913b` |
| `/assets/minato-kunai-share.jpg` | 1200 | 1200 × 1200 | 67370 | JPEG 84 | `5f1de431c8b0bb514075909ba2f44fd9334262ee1687d7c0c8b23b722745d14d` |

## HC-LIGHTFURY

- Source title: `Variation 1 (2).jpg`
- Source Drive ID: `1pMK8OOE9bvE4WsKDRONnPk38k5HQbVaU`
- Drive original SHA-256: `508c5590ee15f6f55c3db605080b0c8a8000e6c9758f0b61aad333786ee1c9e9`
- Metadata-clean source input: `assets/photo-sources/light-fury.jpg`
- Input SHA-256: `371ebf51441bcf82c1feb7afa256b420e0d95d15a2834ad1811fd3f538fe069d`
- Source dimensions: 1500 × 2000; EXIF orientation 1.
- Applied crop box after orientation: `(0, 0, 1500, 2000)`.
- Square storefront frame (inside the applied crop): `(0, 300, 1500, 1800)`. Centres the figure and its tail.
- Link-preview image: the square storefront frame at 1200 × 1200, baseline JPEG without metadata.

| Output | Resize width | Actual dimensions | Bytes | Quality | Output SHA-256 |
|---|---:|---|---:|---:|---|
| `/assets/light-fury-480.webp` | 480 | 480 × 640 | 10204 | 82 | `b3f42484e301ce003661b4fbb88a6693514483b2aac08158eeb5aef79b119a60` |
| `/assets/light-fury-960.webp` | 960 | 960 × 1280 | 28132 | 82 | `e108d5ac558aca70ca553bdcf48d9ee310da6d878b7d3ac076520acc2568b7a6` |
| `/assets/light-fury-1440.webp` | 1440 | 1440 × 1920 | 50262 | 82 | `76caea753630918bead191910048b3c652b94d5ce562af537bf114ddaebb0cee` |
| `/assets/light-fury-sq-160.webp` | 160 | 160 × 160 | 2330 | 82 | `3bc3dbc88eef7bde0eebbbb4865337958b1f45f1f8fcda44fdd64b955bbf6e42` |
| `/assets/light-fury-sq-320.webp` | 320 | 320 × 320 | 5744 | 82 | `ffd470c98cc3a50cd98b3b6fb9416dd3dd1f039d4af1d01757afd2644a76bf61` |
| `/assets/light-fury-sq-480.webp` | 480 | 480 × 480 | 9820 | 82 | `495b8d538c0496b9df28575c1746a6cc15bccdcbcc6a08e1e4520c23ade75ab5` |
| `/assets/light-fury-sq-640.webp` | 640 | 640 × 640 | 14648 | 82 | `ee003266d74ee4a289856d6834023e769ef6986b81f9634e083148ff674d6ba0` |
| `/assets/light-fury-sq-960.webp` | 960 | 960 × 960 | 26680 | 82 | `932a58d7c4ff151959b893d0431c9a3a6c3f73782259fdf5f33dfb0508260f27` |
| `/assets/light-fury-sq-1200.webp` | 1200 | 1200 × 1200 | 36326 | 82 | `13bc15075daccfb24a45c562fcba908cf2b4dc017289bc2f9548d77f26a6ca77` |
| `/assets/light-fury-share.jpg` | 1200 | 1200 × 1200 | 98869 | JPEG 84 | `5f5606ffc28d374fd73d323a2722a356d9aebdd4ee4255f25f9fe7b77806bf33` |

## brand-logo

- Source title: `HC_WhiteBK-1.png`
- Source Drive ID: `1sHmDdDKtS_qnh76ctrgYkJj_Uokaj23e`
- Drive original SHA-256: `1a31b02c4343ed657a62d3dd49a86d5fe6b950b0d68b747877828ab4288ad08e`
- Metadata-clean source input: `assets/photo-sources/honeycomb-logo.png`
- Input SHA-256: `1a31b02c4343ed657a62d3dd49a86d5fe6b950b0d68b747877828ab4288ad08e`
- Source dimensions: 8334 × 8334; EXIF orientation 1.
- Applied crop box after orientation: `(583, 3156, 8018, 5385)`.

This is the allowed raster option: the verified HC_WhiteBK-1.png artwork is cropped to the same established logo box and resized to 660 × 198 PNG. The former 7435 × 2229 web crop and the full 8334 × 8334 original are not served.

| Output | Resize width | Actual dimensions | Bytes | Quality | Output SHA-256 |
|---|---:|---|---:|---:|---|
| `/assets/honeycomb-logo-web.png` | 660 | 660 × 198 | 42747 | PNG | `e959b5e60bec3285396e419f8623a43208260257b25b2ebd7f0055c7f45d3421` |

## Pending approved originals

Classic Kunai and Kurama are hidden from the storefront until their approved originals are imported. Their former AI images have been removed from the served assets. Neither pending source below has been imported.
The owner first copies each original into the supplied HoneyComb folder. Verify the new copy against the expected original SHA-256 before adding it to the source manifest.

| Product | Approved source title | Reference Drive ID outside HoneyComb | Expected original SHA-256 |
|---|---|---|---|
| HC-KUNAI | `RAV_4322.jpg` | `1mx3YRM6o4CrGZtIl6TX2ZqnG8cacFDQo` | `f41368debf7c8dad784374727a8c374e64bd33fc89461a0d907f16d5ce3c8722` |
| HC-KURAMA | `1.png` | `1nQvOC8nPm9BNK496GZveJEim2dspvYwN` | `d33853df877263dab5a27300b0f92bd545a12b2111f9828bb411e7d3e9f5a494` |

## Superseded imports (not served)

These exact source titles correct the extra .jpg suffixes recorded in the former provenance document.

| Former asset | Exact source title | Drive ID | QA classification |
|---|---|---|---|
| hidden-leaf.jpg | WhatsApp Image 2026-01-22 at 19.46.02 (2).jpeg | 13NPWedcC7fSpsJZcGQqMb7ZtfOfGii9N | Real; replaced by a single-plate crop |
| kurama.jpg | Pro-1_202604130244.jpeg | 147Cc7NRSivyNKzIixRkvvlI3OACsGVtR | Google AI; removed |
| night-fury.jpg | 20260301_144017.jpg | 1E35H6xX9rDcamwGPXUATv2MMyGIQNDN4 | Real batch; replaced by single-unit photo |
| minato-kunai.jpg | Product Photo (1).jpeg | 12wvXum-YXjOK2RJmaCGEmRTJI1RIqRLm | Google AI; removed |
| light-fury.jpg | Product Photo  (5).jpeg | 1WtFmt7EJjed3Fmwpk7LUl_wiWT95DQzZ | Google AI; removed |
| classic-kunai.jpg | Copy_of_RAV_4322.jpg_202604130724.jpeg | 1xgQx1gPc0au7Q4mNE_In0xrHmQC0JgFk | Google AI; removed |

## Catalog identity and approval

Storefront IDs remain unchanged. Airtable Products is the owner-designated price source, read 11 October 2026; each product records its price field, base, table, record and read date.
Airtable and Drive disagree on Baymax/Kurama SKUs 503/504 (QA F-17), so no SKU migration was made.
There are no compare-at prices or stock counts. Availability stays unconfirmed and catalog approval stays false. Photo approval does not approve the listing, description, availability or public launch.


# Brand symbol favicon

Exported directly from the owner's HONEYCOMB Symbol.pdf; no generated artwork.

- sourceDriveId: 1AOoBNTsdAzj_getImty-054LJWxjzfFq
- sourceTitle: HONEYCOMB Symbol.pdf
- sourceSha256: bbce8e132f6db89881698b75b664fd62555b59c398fdfcec940b5c33a267dcf3
- sourcePage: 1
- renderScale: 2
- renderSize: [6000, 6000]
- cropBox: [1280, 1077, 4650, 4863]
- squarePadding: centered, white
- output: /favicon.ico
- sizes: [16, 32, 48]
- bytes: 5500
- outputSha256: 3784411f3db70b8e9ab6c209c4e472dac1b8c4ed4445b8fb142bf99ff893b0b6
- appleTouchIcon: {'output': '/apple-touch-icon.png', 'size': [180, 180], 'background': '#0c0b0a', 'symbolSize': [121, 136], 'bytes': 11526, 'sha256': '4fbdf6ba7c6fe532e639b0307a77daeb09efc5ab6a7116756a6d73dcdbe86e0e'}

Crop coordinates refer to the 2x rendered first PDF page. Aspect ratio is preserved on a centered white square. ICO contains 16, 32 and 48 pixel frames; no EXIF/XMP/ICC metadata is copied. The 180 x 180 apple-touch-icon.png renders the same page on transparency, fits the symbol in 136 px and centres it on #0c0b0a. Reproduce with python scripts/prepare-favicon.py using Pillow 11.3.0 and PyMuPDF 1.26.5.
