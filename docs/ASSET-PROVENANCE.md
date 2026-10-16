# Website asset provenance

Imported and verified 13 October 2026. The owner approved the real-photo choices on 11 October 2026.
Drive originals were SHA-256 checked against Claude's qa/asset-recommendations.json before import.
Camera, timestamp, GPS and text metadata were removed from the source containers without changing their compressed image pixels. Rendering colour profiles are retained only in the source files. Original EXIF orientation is recorded below and applied before cropping.
Source inputs stay under assets/photo-sources/, outside public/ and dist/. The build copies only the catalog's referenced derivatives.
Outputs use Lanczos resizing, sRGB, WebP (quality shown below) or PNG for the logo. Each WebP photo also has an AVIF twin encoded from the same resized pixels (quality 60, speed 4), kept only when smaller; pages offer it first in <picture> with the WebP as fallback. EXIF, XMP and ICC metadata are stripped from every output. No artwork was generated, retouched or reconstructed.
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
| `/assets/hidden-leaf-480.avif` | 480 | 480 × 211 | 6310 | AVIF 60 | `302127488c2edd9eb73a4945d57869c991f0ccb7552f18d23238671da36b94e4` |
| `/assets/hidden-leaf-960.webp` | 960 | 960 × 422 | 38452 | 82 | `784dbe7234ac62af94f162c336a0031c7ec5eac014b8da942a3de8fcf6fc3614` |
| `/assets/hidden-leaf-960.avif` | 960 | 960 × 422 | 24263 | AVIF 60 | `a9360f145298917aa00b66aeee4fec353590ebe3c3d6b49025452c49c4bce616` |
| `/assets/hidden-leaf-1440.webp` | 1440 | 1440 × 634 | 79138 | 82 | `437caad3c0dfffb60dd8daf0d6e47384893ed3dd566993e1e513aef72a559723` |
| `/assets/hidden-leaf-1440.avif` | 1440 | 1440 × 634 | 53119 | AVIF 60 | `0c8bf6c01d75e65092fb6b70bf1cc461b8ce5a5efb0fe072cace268a4c62e0d2` |
| `/assets/hidden-leaf-sq-160.webp` | 160 | 160 × 160 | 1588 | 82 | `1b9837f5db14a61744c5d00033d0db4261a3439ddba309c83ecf896efc877d3b` |
| `/assets/hidden-leaf-sq-160.avif` | 160 | 160 × 160 | 1406 | AVIF 60 | `83e916ebcd1e750f2eacd2734e50daa1b086b56cc05aa8e3cdc348f745039c6a` |
| `/assets/hidden-leaf-sq-320.webp` | 320 | 320 × 320 | 4058 | 82 | `6024c57c0cf3f6474aac33a43bbd586728aa84aecd69f51fb139303f63cfd2d3` |
| `/assets/hidden-leaf-sq-320.avif` | 320 | 320 × 320 | 3017 | AVIF 60 | `36bd2e2a1b6832167ab61771128a9dd3b04ac6057845ede6f6416ccaa105c615` |
| `/assets/hidden-leaf-sq-480.webp` | 480 | 480 × 480 | 8856 | 82 | `740fffa937980fa4a95a82c7cc14d18399489ffa2e387cf2cb000fa09a3d0a31` |
| `/assets/hidden-leaf-sq-480.avif` | 480 | 480 × 480 | 5507 | AVIF 60 | `44b9b3c21f1546c64691fca7a761df2e57e169035195203cc436c293a31c6bd9` |
| `/assets/hidden-leaf-sq-640.webp` | 640 | 640 × 640 | 14940 | 82 | `3594a05a5eda66538f3ee2e13f6f799a57e43c3ad86d2dbcc6e0d68de4aab08a` |
| `/assets/hidden-leaf-sq-640.avif` | 640 | 640 × 640 | 9767 | AVIF 60 | `c1d24d1436b7720aadadf0c61daa1f087e39a043cb4662b26ceb802a1309552b` |
| `/assets/hidden-leaf-sq-960.webp` | 960 | 960 × 960 | 33236 | 82 | `a2e68f492685f9a9eee982d9f23353e453129dd21b26a285bebb9cf56e9c264c` |
| `/assets/hidden-leaf-sq-960.avif` | 960 | 960 × 960 | 20620 | AVIF 60 | `ad58a6a1e0bd4d12cf82d21703388c09f36db22fb6c6deae9efcdd4d332bb0cd` |
| `/assets/hidden-leaf-sq-1200.webp` | 1200 | 1200 × 1200 | 50574 | 82 | `2c22b301c50fc22ab921459c675ae5f2c3b76a135e75f889e6819c4f6129b8a1` |
| `/assets/hidden-leaf-sq-1200.avif` | 1200 | 1200 × 1200 | 31438 | AVIF 60 | `e35f428d4c717c413c58e7b073b4e05e804842ed11db8934f7fb4be76a617c21` |
| `/assets/hidden-leaf-g2-160.webp` | 160 | 160 × 160 | 3232 | 82 | `91acf2bcb1bb145be559d35d1cb1fdc10a20eb483732382dc7339673956a669f` |
| `/assets/hidden-leaf-g2-160.avif` | 160 | 160 × 160 | 2495 | AVIF 60 | `0c77dcec334b84b72587929ef59b81a5375a96965791a04e3cdffc012cc1cebd` |
| `/assets/hidden-leaf-g2-320.webp` | 320 | 320 × 320 | 11288 | 82 | `78c3a6223f8f6368e2ea1fc156b757c480790cb1f8f619d040b00069c2962013` |
| `/assets/hidden-leaf-g2-320.avif` | 320 | 320 × 320 | 7882 | AVIF 60 | `5b298871c05e4739290b74b045d5bbdec19d4776c7fc9e9d5f4f451fc23ca9ec` |
| `/assets/hidden-leaf-g2-480.webp` | 480 | 480 × 480 | 23952 | 82 | `2d664b89e3be87c9329bc767e7a3544b1ea8e4873a760bf5941a467510ed165a` |
| `/assets/hidden-leaf-g2-480.avif` | 480 | 480 × 480 | 16368 | AVIF 60 | `b2d9fac6faa4e76e3f33548e88433e1cd102886f7b56399321261af7b5e7d16b` |
| `/assets/hidden-leaf-g2-640.webp` | 640 | 640 × 640 | 38990 | 82 | `5a8fe30feb0456d7b9dc4a84c8606943f3a3f3af9caada2d2da8c7a493ab67b6` |
| `/assets/hidden-leaf-g2-640.avif` | 640 | 640 × 640 | 27268 | AVIF 60 | `fabbcbeeb4278211f68841643b3622c40582d4b7e709480e5330adeae4479983` |
| `/assets/hidden-leaf-g2-770.webp` | 770 | 770 × 770 | 55564 | 82 | `8fd28d63e926265af6186da05196e6162ebb2ce70fc066b2d92e8448a08618c4` |
| `/assets/hidden-leaf-g2-770.avif` | 770 | 770 × 770 | 38229 | AVIF 60 | `29ee3806eff344d22d4622ca7dc47cfe7604330eda4b06cbc0351bcb4177bcf0` |
| `/assets/hidden-leaf-g3-160.webp` | 160 | 160 × 160 | 2222 | 82 | `07c9648bd99f42373ad1f30392d824c4ede189e78b3e60562d7d051fa000fdac` |
| `/assets/hidden-leaf-g3-160.avif` | 160 | 160 × 160 | 1715 | AVIF 60 | `afe8a617b439c314eac5f086477dbd651f791922d696a6549057704ef7ecda0d` |
| `/assets/hidden-leaf-g3-320.webp` | 320 | 320 × 320 | 8846 | 82 | `ffcdbcd1e0a60f764e72e2e1a5876773c921f3364a6032324417bff3e9de156a` |
| `/assets/hidden-leaf-g3-320.avif` | 320 | 320 × 320 | 5705 | AVIF 60 | `993d6af2fcc535b722732dc931a8be91d9e247b0c5dbbbee465fb733ff4cdf2e` |
| `/assets/hidden-leaf-g3-480.webp` | 480 | 480 × 480 | 20920 | 82 | `f2acd171b23fb158dbe96c6c20e718e34763ad16190f3f331786b0cfa48eea99` |
| `/assets/hidden-leaf-g3-480.avif` | 480 | 480 × 480 | 13290 | AVIF 60 | `f88553278138771172837bd2f8a05314e18fd6287f5fd9d7a20ce90e31d4e72d` |
| `/assets/hidden-leaf-g3-640.webp` | 640 | 640 × 640 | 35736 | 82 | `16913d3621c7ea263ad7ebf57326e5bee374dc7a8b53c9b953c8d0d15713e9a5` |
| `/assets/hidden-leaf-g3-640.avif` | 640 | 640 × 640 | 24120 | AVIF 60 | `93c86e15420d92d6d259b0674e4e35d906151c373a241cc37f3610fc08368084` |
| `/assets/hidden-leaf-g3-770.webp` | 770 | 770 × 770 | 51844 | 82 | `5eb860918aa32d0325f6d90cb4f87da7715135d3b4781c47b311744272c96cbe` |
| `/assets/hidden-leaf-g3-770.avif` | 770 | 770 × 770 | 33664 | AVIF 60 | `13bbf9971a4473eae3f79a416829ab3a13387fdd5c8a3c4a9cfc55ec00f3ab1a` |
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
| `/assets/baymax-480.avif` | 480 | 480 × 640 | 20421 | AVIF 60 | `1bc5c8ec4f851cc7dda1d1d7d996d8b6dece45a33ac9ecdffc0961da8528a45e` |
| `/assets/baymax-960.webp` | 960 | 960 × 1280 | 91622 | 82 | `72e907f1342fbb8e4e489114a48109874a0b19c36071d5643a3250c21565106f` |
| `/assets/baymax-960.avif` | 960 | 960 × 1280 | 64186 | AVIF 60 | `7b6a7308f1d64c8a25b647bed7f20ad4f51ac8b73192b0fe256b363b69b8db38` |
| `/assets/baymax-1440.webp` | 1440 | 1440 × 1920 | 174868 | 82 | `0c76fede0f9678fda981bf49026d6c25f688df3954f19cbe5676a83fdc520dcf` |
| `/assets/baymax-1440.avif` | 1440 | 1440 × 1920 | 121635 | AVIF 60 | `b7223ef5835bc6a988897afef82458fc5ee45131644b5476ac2cd918df762047` |
| `/assets/baymax-sq-160.webp` | 160 | 160 × 160 | 3646 | 82 | `c3b6bdc9d754a89a5e0e836c4cd8c97afe620f1506277f2ed51c871219f22dd6` |
| `/assets/baymax-sq-160.avif` | 160 | 160 × 160 | 3195 | AVIF 60 | `1168c6758d06190d7e910418d2b75c36e292221ea28716a8fb8e7f734b6380e9` |
| `/assets/baymax-sq-320.webp` | 320 | 320 × 320 | 12108 | 82 | `9ebe7175b33bb183cf2afc137a92666af033f4e2d33b3619948ec55419d9c2da` |
| `/assets/baymax-sq-320.avif` | 320 | 320 × 320 | 9469 | AVIF 60 | `ea1c8f03555a5ab054526b7b1caa8837d1848930a35c2d2a57026bb3e8e19bd2` |
| `/assets/baymax-sq-480.webp` | 480 | 480 × 480 | 25188 | 82 | `f56dcd5a8939ad3b8774b52074adce0fb3deed97615a0938f5c596ea88f290af` |
| `/assets/baymax-sq-480.avif` | 480 | 480 × 480 | 18695 | AVIF 60 | `cf0c62668acb9cc1f419f976b117e475ad618550f6a61d99fe511bc6bd94a966` |
| `/assets/baymax-sq-640.webp` | 640 | 640 × 640 | 41458 | 82 | `856ec11c7318be0a618482c94d0bafd0c5aa3a9bfe4c3f5c0550b3d6fc738101` |
| `/assets/baymax-sq-640.avif` | 640 | 640 × 640 | 30870 | AVIF 60 | `1626a2883b57454daf00e61ba17d10c411c6b4086f4ecde72b6f6048f36ba33b` |
| `/assets/baymax-sq-960.webp` | 960 | 960 × 960 | 82492 | 82 | `42e3d86e2a3f4e947119e5a955831adb5c702474ee0a229dd3cd7a469a56523c` |
| `/assets/baymax-sq-960.avif` | 960 | 960 × 960 | 60467 | AVIF 60 | `7ca11bac74a1785e6e9f60612f2dbb58c0fc14c46d0cf100de978a5b97567d08` |
| `/assets/baymax-sq-1200.webp` | 1200 | 1200 × 1200 | 119270 | 82 | `52b777d3455d694898a299b4f5440e97f9af86729a689e19f02e2c42d2968182` |
| `/assets/baymax-sq-1200.avif` | 1200 | 1200 × 1200 | 85014 | AVIF 60 | `413bcdecdbb44c7fd87fbce898fe8a1a0f1d3a3ba36425d8da0f14ef19d9827f` |
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
| `/assets/night-fury-480.avif` | 480 | 480 × 360 | 10098 | AVIF 60 | `e9a98f7432578b3cc151a8b9c8b2737c8730cfa6d22a8d292dc15ce69739ab34` |
| `/assets/night-fury-960.webp` | 960 | 960 × 720 | 37432 | 82 | `2071959e347554061056f0c997e4834b37519adb10c4b609ccfce9bf7867bb70` |
| `/assets/night-fury-960.avif` | 960 | 960 × 720 | 24097 | AVIF 60 | `85c905685e1ce905105f94253d9511eee922f394b9886ff36afd54620f8c51db` |
| `/assets/night-fury-1440.webp` | 1440 | 1440 × 1080 | 65288 | 82 | `e1f5abdffb91b9542ea26845ca57a53a66980d2cf97773b9c271005110b16dbe` |
| `/assets/night-fury-1440.avif` | 1440 | 1440 × 1080 | 39622 | AVIF 60 | `0e3b0fdcee074bcb43e836c0fd9b1cc540806e5a4be6bbd305480eb95caca026` |
| `/assets/night-fury-sq-160.webp` | 160 | 160 × 160 | 4416 | 82 | `e4da14a88a0cd445ab1ea6c7fbe12a8d4f11536d791a9a56ba634ee304731b97` |
| `/assets/night-fury-sq-160.avif` | 160 | 160 × 160 | 3787 | AVIF 60 | `af98076cdf8cd403d243239c867c5d82c8410c9f8629bdee8bd3482cbbbf7c07` |
| `/assets/night-fury-sq-320.webp` | 320 | 320 × 320 | 11300 | 82 | `f171e0233af66fa4448ac12c995de1173c9e59a748abdc1688bbbba220fc83d2` |
| `/assets/night-fury-sq-320.avif` | 320 | 320 × 320 | 8384 | AVIF 60 | `f4442c464c793df0f3ea531774d61d6e775a7302237d35cc098c0bd35a43fb31` |
| `/assets/night-fury-sq-480.webp` | 480 | 480 × 480 | 19770 | 82 | `5f0288b1bacd43f6efdc84a5606cb40366559faf6dae6e9f5759ec8b43e17d6b` |
| `/assets/night-fury-sq-480.avif` | 480 | 480 × 480 | 13543 | AVIF 60 | `12efe994cd11deb3ad97480b278c51f19ad7aa4c12f1502e85e42e487b3ddbd2` |
| `/assets/night-fury-sq-640.webp` | 640 | 640 × 640 | 29256 | 82 | `9530e86ee2856af28560674109f61c0f6d0e54e4b9416b59de1fdba83e4a7601` |
| `/assets/night-fury-sq-640.avif` | 640 | 640 × 640 | 19924 | AVIF 60 | `84e3fa9492b34f3829ba7ebb91b4ace32e3774b9099d288f896d48d6b14c5991` |
| `/assets/night-fury-sq-960.webp` | 960 | 960 × 960 | 50340 | 82 | `dea3be4fd9c0f8ddb9cfd7e517409b1eaf87445139d58e9b29929c7315006402` |
| `/assets/night-fury-sq-960.avif` | 960 | 960 × 960 | 32801 | AVIF 60 | `ea23a6ddea349787b435e86db16843eec850da8672afdbadd76e4b7966f40693` |
| `/assets/night-fury-sq-1200.webp` | 1200 | 1200 × 1200 | 68408 | 82 | `0c473534c6a8db00444e6f31895d7745426a96b77f835e45aab51305a15def78` |
| `/assets/night-fury-sq-1200.avif` | 1200 | 1200 × 1200 | 42823 | AVIF 60 | `c2b1ef7e8279e52213e1f8a59f3365fca2e66ae9fcda7a51af24a5ce3111a8bc` |
| `/assets/night-fury-hero-landscape-960.webp` | 960 | 960 × 480 | 32056 | 82 | `8f911c242137d4587e5928f3c77e6c871291c1a26a673484e84efa4ad6a87d6c` |
| `/assets/night-fury-hero-landscape-960.avif` | 960 | 960 × 480 | 21381 | AVIF 60 | `ce357d78e66c2891449ae94d804600ae71275ae39b9d4a9bb0605761ced32330` |
| `/assets/night-fury-hero-landscape-1280.webp` | 1280 | 1280 × 640 | 47668 | 82 | `fc51f086b2e7c3493f5434340e413acde1406e64a7b4a7ce5ce1887f72b924cd` |
| `/assets/night-fury-hero-landscape-1280.avif` | 1280 | 1280 × 640 | 30504 | AVIF 60 | `d1ae13a025b95e7fb8159b70e91fcc89744d7c56e12575ce3639a75474ab5c60` |
| `/assets/night-fury-hero-landscape-1600.webp` | 1600 | 1600 × 800 | 64520 | 82 | `882cb4c4b2db25952fb9437d672aa9e02cfad58c39ef4d9f244f186b0fd1fee7` |
| `/assets/night-fury-hero-landscape-1600.avif` | 1600 | 1600 × 800 | 39793 | AVIF 60 | `71f46b40b61ac6539bb9147ed12fa449c47eb6bd13fc7affe28e3d8fe11a4a57` |
| `/assets/night-fury-hero-landscape-1893.webp` | 1893 | 1893 × 946 | 80530 | 82 | `048bef15e77ed7e3159e9789aee6e51316eb8e441028c61fcce78cd0b8f68596` |
| `/assets/night-fury-hero-landscape-1893.avif` | 1893 | 1893 × 946 | 48310 | AVIF 60 | `39e7727c8deb214acf7c0bfe78af332e804357a582b07a1e07526e7cbd05ae8c` |
| `/assets/night-fury-hero-portrait-480.webp` | 480 | 480 × 640 | 25756 | 82 | `6aa20a795e485be19d8183d2b7fb09bfd3aee9535f8e4199c31be9be2e592666` |
| `/assets/night-fury-hero-portrait-480.avif` | 480 | 480 × 640 | 18424 | AVIF 60 | `1f06f06e9fac4f69aefd8f7e077e7ec3ad9f3e41e3b0b8a2a8494d62aff55415` |
| `/assets/night-fury-hero-portrait-720.webp` | 720 | 720 × 960 | 45514 | 82 | `870734819b4708c1c26a2db7c8e9e427ffb693da6826b630eccef58b5126122a` |
| `/assets/night-fury-hero-portrait-720.avif` | 720 | 720 × 960 | 30623 | AVIF 60 | `0c2c0e1feddee9fe70b5e3a8d5217b276e01cad6b1a6063b5574745133846189` |
| `/assets/night-fury-hero-portrait-960.webp` | 960 | 960 × 1280 | 68160 | 82 | `8bfe5b8bc444125d725952a43eee1b880ffa33167c4814d5251eb70447f2dee3` |
| `/assets/night-fury-hero-portrait-960.avif` | 960 | 960 × 1280 | 43489 | AVIF 60 | `daf37d6712050029fad28936ef80ad92592efc69d2e7095d2ca0720595cf32e3` |
| `/assets/night-fury-hero-portrait-1065.webp` | 1065 | 1065 × 1420 | 74826 | 82 | `b717079dd6f830bc1b91141bf70d690b5983a33489769f12365134d233656788` |
| `/assets/night-fury-hero-portrait-1065.avif` | 1065 | 1065 × 1420 | 48512 | AVIF 60 | `eebdd5ba9ad880c9e3dc770983d675c0ccb81dc0fa1ece9f3cbf9a182c44b1a3` |
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
| `/assets/minato-kunai-160.avif` | 160 | 160 × 358 | 2640 | AVIF 60 | `1c0f53d35b8707e8febaa94d760f6795f1aa9bc2c72e84669bff0c1e3f118eec` |
| `/assets/minato-kunai-240.webp` | 240 | 240 × 538 | 6474 | 82 | `7fd13d17c5885ef58d47711bf43b0e44457dcd07300459433d59d34e90c0820e` |
| `/assets/minato-kunai-240.avif` | 240 | 240 × 538 | 4579 | AVIF 60 | `561e7ef105491d784aa4b31899a62d52403a5348abe0059d55c35d7972f6243b` |
| `/assets/minato-kunai-480.webp` | 480 | 480 × 1075 | 20718 | 82 | `9880a18df2a171585733ea002c0dec08d1b319dd1a11d1d832020b3333617f79` |
| `/assets/minato-kunai-480.avif` | 480 | 480 × 1075 | 14023 | AVIF 60 | `0578282817b9f6229c36ee63787ba1e6b10eba3984994a8270859dd0c2c0cc36` |
| `/assets/minato-kunai-960.webp` | 960 | 960 × 2151 | 93218 | 82 | `3490f32cac68d84b5c6097e9f5a2af038298c2fcec41e090c367bb263ad259e4` |
| `/assets/minato-kunai-960.avif` | 960 | 960 × 2151 | 57018 | AVIF 60 | `9384a0fd0afddd429ef809f175c25e7c7eb6c3b1ae5c6338fbf5f80d6699dfb8` |
| `/assets/minato-kunai-1440.webp` | 1440 | 1440 × 3226 | 251428 | 82 | `34d72359b337d2f5f14ef44c1c1e9754a98dc05d39530adfc70748aca137c1f2` |
| `/assets/minato-kunai-1440.avif` | 1440 | 1440 × 3226 | 146772 | AVIF 60 | `53bb6b3cfa6aadacea329f1cd71afbde9c106cab07d3c64e659b937e7d46e84f` |
| `/assets/minato-kunai-sq-160.webp` | 160 | 160 × 160 | 1228 | 82 | `6d81157b1f7ac4f3c5f93c06699c06b3e0fbcc3ef09b3855c043f4dbb7051ea9` |
| `/assets/minato-kunai-sq-160.avif` | 160 | 160 × 160 | 1176 | AVIF 60 | `b41c0d90657523ab299bbc3dc029e72b9c657a9697640865716e9df0cc87fa88` |
| `/assets/minato-kunai-sq-320.webp` | 320 | 320 × 320 | 3034 | 82 | `4d28ec398615b8d0b6e730ffb8622bc41262b13be2d5106a70d43d2adee58baf` |
| `/assets/minato-kunai-sq-320.avif` | 320 | 320 × 320 | 2238 | AVIF 60 | `a4a42ded80e8edd09eb39d09c3c7312b235d38e082f972b99073e425480dfcc1` |
| `/assets/minato-kunai-sq-480.webp` | 480 | 480 × 480 | 5670 | 82 | `134c5a8faa657b729c15fac81379e04d1cf7de423a24c53b4a0683ff2c579c99` |
| `/assets/minato-kunai-sq-480.avif` | 480 | 480 × 480 | 3829 | AVIF 60 | `ed35a381d14d7dce3bb08e403b4617558d0c4cf05aadf2600dfc5d70a8ab6a61` |
| `/assets/minato-kunai-sq-640.webp` | 640 | 640 × 640 | 9180 | 82 | `509436116d935f3ebda384389553adeb8c8861dbb82bd4b01f8392f14447f339` |
| `/assets/minato-kunai-sq-640.avif` | 640 | 640 × 640 | 5981 | AVIF 60 | `5a98edf7f4e348713af579cbe6d6bd8a1630ed7f9ccc652712c00de949ed7d43` |
| `/assets/minato-kunai-sq-960.webp` | 960 | 960 × 960 | 18292 | 82 | `907103368b5858a42ef3847dd5919d26c578e8a81246aded3b938634ec9cfdaa` |
| `/assets/minato-kunai-sq-960.avif` | 960 | 960 × 960 | 11715 | AVIF 60 | `aba67bb60c39aa21a53e38c2c618f4d5be08975bf08307c67dbdd8a0b588e4cd` |
| `/assets/minato-kunai-sq-1200.webp` | 1200 | 1200 × 1200 | 27422 | 82 | `803302b86666e8d2f09c74c62f02fda8ba8482b8c6b0be3cc6007d82a3ff184a` |
| `/assets/minato-kunai-sq-1200.avif` | 1200 | 1200 × 1200 | 17254 | AVIF 60 | `9eef00273eaa618e82def00bf495b2162243894112d76f3b5ecb3568ee0a754a` |
| `/assets/minato-kunai-g2-160.webp` | 160 | 160 × 160 | 1866 | 82 | `9849929b329dfa1fd5d35a66973e4f4d0013dcadf491556378d60734a8999391` |
| `/assets/minato-kunai-g2-160.avif` | 160 | 160 × 160 | 1645 | AVIF 60 | `bc92a4c4bd2f7ecb13f159028f0947949d20dafea04082fec64c707dd318a1d4` |
| `/assets/minato-kunai-g2-320.webp` | 320 | 320 × 320 | 5274 | 82 | `614914d378cbb2a606f1ff1bafcb00a14fa339bc6c6e1f69e89253fa6d676068` |
| `/assets/minato-kunai-g2-320.avif` | 320 | 320 × 320 | 3831 | AVIF 60 | `61591bc4895a81ded840b77dde7ea18de0158f103ab7408b9941a7172a136e2c` |
| `/assets/minato-kunai-g2-480.webp` | 480 | 480 × 480 | 9738 | 82 | `ad02a6ee4457279d6ef2d7644a89a8ed48652b6b9e487ec57ca37f6f20b747dc` |
| `/assets/minato-kunai-g2-480.avif` | 480 | 480 × 480 | 6864 | AVIF 60 | `f37a8dd6a3d1e6d197be5390b4bd8d3222fcaa71adf1ec2098891f0004788ea8` |
| `/assets/minato-kunai-g2-640.webp` | 640 | 640 × 640 | 17036 | 82 | `4d5cc866b87e74da57559b11ac6c6e8de30ca662d8cc6d63d39c09b69b65b0e8` |
| `/assets/minato-kunai-g2-640.avif` | 640 | 640 × 640 | 11273 | AVIF 60 | `3db7241771ee7dcb10d2917ce0422605f96719e53b346bbcd3607ba1f37cecb9` |
| `/assets/minato-kunai-g2-960.webp` | 960 | 960 × 960 | 47800 | 82 | `7ac893191b13968986c4d966f457cbbd2fae040b855992f096027e44cee55208` |
| `/assets/minato-kunai-g2-960.avif` | 960 | 960 × 960 | 28088 | AVIF 60 | `8e1ef1812281dcea3c3f22fc7c302b1b4beb8e3292d0d4fa313bcc402d99fabc` |
| `/assets/minato-kunai-g2-1200.webp` | 1200 | 1200 × 1200 | 88300 | 82 | `b5b4b6a21cc19b104c8af1b65d0e99d9750b1a24c1313ba62f25f019691f1fa3` |
| `/assets/minato-kunai-g2-1200.avif` | 1200 | 1200 × 1200 | 49816 | AVIF 60 | `2515e4be126374fbf8eaeca80d6e3c68652e77ed5438afb99fbc6a5ae562da84` |
| `/assets/minato-kunai-g3-160.webp` | 160 | 160 × 160 | 1806 | 82 | `973b6b187c6c4e53f7115335fecd99094217e5204798ab019fb4e9611cf0f75e` |
| `/assets/minato-kunai-g3-160.avif` | 160 | 160 × 160 | 1605 | AVIF 60 | `8ef6faa4d9dd33125d89ab13847ec48eea7ef4c0cc68e741d4e9ac175bfe71cd` |
| `/assets/minato-kunai-g3-320.webp` | 320 | 320 × 320 | 5400 | 82 | `a35e7894af42b943041ad30cf51c5993d78283a1239e73ad359ea4603fb7ec13` |
| `/assets/minato-kunai-g3-320.avif` | 320 | 320 × 320 | 4279 | AVIF 60 | `1ee4117dd6e4cb520519b79b8803f89d8ccae8cf1de0cc2a1ff3b7778584c959` |
| `/assets/minato-kunai-g3-480.webp` | 480 | 480 × 480 | 11544 | 82 | `2b368bbf33adb48db35d2143a1fe0ac3fb215e68860d6a7f9b77be5dc55de120` |
| `/assets/minato-kunai-g3-480.avif` | 480 | 480 × 480 | 8361 | AVIF 60 | `1794cda868f075911701b6f29d06d362d1a4fb4ad745f5ba0edbbf7cf4473b39` |
| `/assets/minato-kunai-g3-640.webp` | 640 | 640 × 640 | 20502 | 82 | `ca624aa352bd52e17c44b3070eba2a4708871a9d993583ed7249e1c56d7ed5b5` |
| `/assets/minato-kunai-g3-640.avif` | 640 | 640 × 640 | 14084 | AVIF 60 | `db816597aad2414b8239c99f1f771501afb35af8d1fdce9e6c39b04dba4f56be` |
| `/assets/minato-kunai-g3-960.webp` | 960 | 960 × 960 | 50612 | 82 | `0ec76cfe59dd09869629a891b4bbcb8a82ac7fcdb180fed6e7253e71bc3d3f62` |
| `/assets/minato-kunai-g3-960.avif` | 960 | 960 × 960 | 31281 | AVIF 60 | `926d1b664dfaaa8c1715f8b6768bdd4427a0bf7fd259f4392310f6f1dcf327a3` |
| `/assets/minato-kunai-g3-1200.webp` | 1200 | 1200 × 1200 | 84564 | 82 | `c8012b3bd0a2cd8a331325b8e36f0fc0641cbef3b137dc41ad8bf3a284a3ceea` |
| `/assets/minato-kunai-g3-1200.avif` | 1200 | 1200 × 1200 | 49672 | AVIF 60 | `61616773159772e8f63169de26e2d341bd1f5908ecca4598e612420a51d68225` |
| `/assets/minato-kunai-g4-160.webp` | 160 | 160 × 160 | 1438 | 82 | `76112521390187a4a64ddd45e7f118e3da32d47cd64c87f7ad24f83f2f9252ea` |
| `/assets/minato-kunai-g4-160.avif` | 160 | 160 × 160 | 1179 | AVIF 60 | `e0d61d396f22c6491a009ae110888f217ccf0ee894ed39379a3eb3ea0f2b188e` |
| `/assets/minato-kunai-g4-320.webp` | 320 | 320 × 320 | 4014 | 82 | `44bd2cf8fec2b9828a5af1817030cc86451943ccffd5c1bd2bf813673234ff42` |
| `/assets/minato-kunai-g4-320.avif` | 320 | 320 × 320 | 2669 | AVIF 60 | `49e44d5a42b9881339efc6b4f4387920fa6f74843064ebcd14e48eb0926cc193` |
| `/assets/minato-kunai-g4-480.webp` | 480 | 480 × 480 | 7766 | 82 | `8a87bd29b77d9d87b7b70353b841cf58dbf060846eab7000c46297e5b9b3b111` |
| `/assets/minato-kunai-g4-480.avif` | 480 | 480 × 480 | 5140 | AVIF 60 | `94a4c84fb4fe8a24804fdb2b956a0737c2ba3d51a2f079994bb91d9f540ff9b9` |
| `/assets/minato-kunai-g4-640.webp` | 640 | 640 × 640 | 13626 | 82 | `6db0cb17d88c0cf3337df6dc16562d1d2fae3bf7049e283eb86933e525016742` |
| `/assets/minato-kunai-g4-640.avif` | 640 | 640 × 640 | 9005 | AVIF 60 | `b0fb8915c484e25a38a87e13b40a7df0d1fcf0c551c2a6f82ac22a9b7980a025` |
| `/assets/minato-kunai-g4-960.webp` | 960 | 960 × 960 | 35852 | 82 | `8b6cc1f54ab8103ce8841db455895ebf12abf62ea4ae81c023caf9026ee77d5a` |
| `/assets/minato-kunai-g4-960.avif` | 960 | 960 × 960 | 22339 | AVIF 60 | `c257105bc6d49e85a8c8aa8d1760bec91e813c112178f94d3799d4fd897190f7` |
| `/assets/minato-kunai-g4-1200.webp` | 1200 | 1200 × 1200 | 65284 | 82 | `4843e447aca750e4e4ed8e19bc09da5c11318dde882698f555c9b72b07ad913b` |
| `/assets/minato-kunai-g4-1200.avif` | 1200 | 1200 × 1200 | 40500 | AVIF 60 | `61c8539339b8f348c355ff09a7bc0e091c6b0febc6146d477379681e487ad474` |
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
| `/assets/light-fury-480.avif` | 480 | 480 × 640 | 6832 | AVIF 60 | `f2270d1b16de92996f173faba6fa7317bb45bfcb2ad23138e4fbc56358750f83` |
| `/assets/light-fury-960.webp` | 960 | 960 × 1280 | 28132 | 82 | `e108d5ac558aca70ca553bdcf48d9ee310da6d878b7d3ac076520acc2568b7a6` |
| `/assets/light-fury-960.avif` | 960 | 960 × 1280 | 16067 | AVIF 60 | `5ad87d673e7b9ca4375acbe9114ff39d3a43d8492f4422cdec578e8755811709` |
| `/assets/light-fury-1440.webp` | 1440 | 1440 × 1920 | 50262 | 82 | `76caea753630918bead191910048b3c652b94d5ce562af537bf114ddaebb0cee` |
| `/assets/light-fury-1440.avif` | 1440 | 1440 × 1920 | 25549 | AVIF 60 | `9361eb721eefdffdf926e9d9273d73eb8737ebc69fa6e655523997f027f16313` |
| `/assets/light-fury-sq-160.webp` | 160 | 160 × 160 | 2330 | 82 | `3bc3dbc88eef7bde0eebbbb4865337958b1f45f1f8fcda44fdd64b955bbf6e42` |
| `/assets/light-fury-sq-160.avif` | 160 | 160 × 160 | 2038 | AVIF 60 | `721a5fbbd39340a565ad8c7684b5f7857a34664bf2e18cab0a7859f9d4c5bd04` |
| `/assets/light-fury-sq-320.webp` | 320 | 320 × 320 | 5744 | 82 | `ffd470c98cc3a50cd98b3b6fb9416dd3dd1f039d4af1d01757afd2644a76bf61` |
| `/assets/light-fury-sq-320.avif` | 320 | 320 × 320 | 4142 | AVIF 60 | `f52f9bb2df0642137712f5615d5cef38bbb4262c08b96d92cba33545f42fe7da` |
| `/assets/light-fury-sq-480.webp` | 480 | 480 × 480 | 9820 | 82 | `495b8d538c0496b9df28575c1746a6cc15bccdcbcc6a08e1e4520c23ade75ab5` |
| `/assets/light-fury-sq-480.avif` | 480 | 480 × 480 | 6657 | AVIF 60 | `09d887c2c1025475b6e6f25e160476486b31d64be405da7c851dae4aa06f5f2d` |
| `/assets/light-fury-sq-640.webp` | 640 | 640 × 640 | 14648 | 82 | `ee003266d74ee4a289856d6834023e769ef6986b81f9634e083148ff674d6ba0` |
| `/assets/light-fury-sq-640.avif` | 640 | 640 × 640 | 9482 | AVIF 60 | `075d6afc744715176e55add9d32a1fb5e2c83d720642d5cef4dcd78fee144178` |
| `/assets/light-fury-sq-960.webp` | 960 | 960 × 960 | 26680 | 82 | `932a58d7c4ff151959b893d0431c9a3a6c3f73782259fdf5f33dfb0508260f27` |
| `/assets/light-fury-sq-960.avif` | 960 | 960 × 960 | 15841 | AVIF 60 | `37d9435a7689a95afe0e846192c079ccca28fbf9d0b7e689996bdab3cd9bb544` |
| `/assets/light-fury-sq-1200.webp` | 1200 | 1200 × 1200 | 36326 | 82 | `13bc15075daccfb24a45c562fcba908cf2b4dc017289bc2f9548d77f26a6ca77` |
| `/assets/light-fury-sq-1200.avif` | 1200 | 1200 × 1200 | 20198 | AVIF 60 | `55ada51a49d7cbe8a3fa11f28c51245c2f3bc8109e9d9d6f31003e5fe35650e7` |
| `/assets/light-fury-share.jpg` | 1200 | 1200 × 1200 | 98869 | JPEG 84 | `5f5606ffc28d374fd73d323a2722a356d9aebdd4ee4255f25f9fe7b77806bf33` |

## HC-KURAMA

- Source title: `1.png`
- Source Drive ID: `1wkBiKm7ZUMRYRpHJojCI9YPhv3ePKIXn`
- Drive original SHA-256: `d33853df877263dab5a27300b0f92bd545a12b2111f9828bb411e7d3e9f5a494`
- Metadata-clean source input: `assets/photo-sources/kurama.png`
- Input SHA-256: `c245fbe4383675aedf68570a02299177fe9ef69dadbc33456eb0af35cd4eabcf`
- Handoff: QA branch claude/photo-handoff commit 4cefd25 (kurama-1.png), SHA-256 verified before import; Drive copy in the owner's HoneyComb folder. Metadata removed with scripts/clean-source.py; decoded pixels verified identical to the original.
- Source dimensions: 3415 × 5120; EXIF orientation 1.
- Applied crop box after orientation: `(487, 1228, 2937, 3876)`.
- Square storefront frame: the whole applied crop centred on a 2648 × 2648 square whose padding repeats the crop edge tones outward (averaged per row or column and smoothed; median backdrop `#ffffff`), with a 106 px edge fade. Shows the whole figure, tail tips to paws, on its white Canva background.
- Link-preview image: the square storefront frame at 1200 × 1200, baseline JPEG without metadata.

| Output | Resize width | Actual dimensions | Bytes | Quality | Output SHA-256 |
|---|---:|---|---:|---:|---|
| `/assets/kurama-480.webp` | 480 | 480 × 519 | 15700 | 82 | `d015f554b36069edc56dec09fb18dbc2434329c6a1f6e5e0de7d19ce1dbebc56` |
| `/assets/kurama-480.avif` | 480 | 480 × 519 | 9009 | AVIF 60 | `ddb25e7347600b42dd08b70de42596b54bff362a4446e939032ffeaad1d1678a` |
| `/assets/kurama-960.webp` | 960 | 960 × 1038 | 36632 | 82 | `54ffe8463ff6dba5ae69bc8f079f76d6755b5982f0b4d68c010d9a8571c9e3b9` |
| `/assets/kurama-960.avif` | 960 | 960 × 1038 | 19511 | AVIF 60 | `c248fb5e754e44599d4835f15312dc513409a938a4a7b9bbde5fac1680fe007d` |
| `/assets/kurama-1440.webp` | 1440 | 1440 × 1556 | 60714 | 82 | `f1c01067235f43de0ef79d3c8ef02dd56a9347217d4e1266d76ef20db632d6bf` |
| `/assets/kurama-1440.avif` | 1440 | 1440 × 1556 | 31072 | AVIF 60 | `e25466ace3ecd6d5a073d5777c02a409434459807b46ffd292fd1ade312b60a6` |
| `/assets/kurama-sq-160.webp` | 160 | 160 × 160 | 3724 | 82 | `160260fcc2b5b216345e06a040fdb6140066a668f1fb3a2320b8fc8db6bee691` |
| `/assets/kurama-sq-160.avif` | 160 | 160 × 160 | 2765 | AVIF 60 | `60b428a05dca0932e8e18c7a4a42989829cb32994a34a1f88e04d2b24f1c1255` |
| `/assets/kurama-sq-320.webp` | 320 | 320 × 320 | 8662 | 82 | `8fe39c9487aea459c1e998dfe215a575b399a0524c599b90740a40a02fe9c4fc` |
| `/assets/kurama-sq-320.avif` | 320 | 320 × 320 | 5437 | AVIF 60 | `5a8b693dac46618d5d0ed2e8034c774a2ca38250ca01b017b9b305de21a2490b` |
| `/assets/kurama-sq-480.webp` | 480 | 480 × 480 | 14288 | 82 | `5ba4cc4d020359dc5a736416529f2eb81eda343c27c08759282c13d7505df349` |
| `/assets/kurama-sq-480.avif` | 480 | 480 × 480 | 8257 | AVIF 60 | `93e3f63a1f93512b96e09cafe4250372d359c76a1b50967958fcc98828020ff1` |
| `/assets/kurama-sq-640.webp` | 640 | 640 × 640 | 20192 | 82 | `91dd9585f75d7b19941d2902d40dc9aad64afe264d17f27d84fdcdfda0db9a54` |
| `/assets/kurama-sq-640.avif` | 640 | 640 × 640 | 11277 | AVIF 60 | `067d50e7b3d5df6d12e7db62640c1e40096ca93875fc6fb8555e0a8af73aa58d` |
| `/assets/kurama-sq-960.webp` | 960 | 960 × 960 | 33118 | 82 | `c40ad6713361f745eee8f178223aaf631b2830e87128fc0ff3576419b12225ba` |
| `/assets/kurama-sq-960.avif` | 960 | 960 × 960 | 17729 | AVIF 60 | `513b33c4b43197fe29c064e85ee367e16dc17bbe05f0af825b764a7ceeccb3f3` |
| `/assets/kurama-sq-1200.webp` | 1200 | 1200 × 1200 | 43602 | 82 | `81c750aba6661de079013390f9fb6e6a0df61cc73a905992dd167a45c1fef3d1` |
| `/assets/kurama-sq-1200.avif` | 1200 | 1200 × 1200 | 22859 | AVIF 60 | `6f091179acc2e60604534f628da098d24badafeeb69f2276c0752e29223b5e4a` |
| `/assets/kurama-share.jpg` | 1200 | 1200 × 1200 | 92388 | JPEG 84 | `f09f3fb3759f0d0fb4103c86af7083b6a7999e1210c195a8248201cdf4019ce1` |

## HC-KUNAI

- Source title: `Copy of RAV_4322.jpg`
- Source Drive ID: `1PaOuVcZ82ij2vV2hq08fiFC42_w9iKua`
- Drive original SHA-256: `f41368debf7c8dad784374727a8c374e64bd33fc89461a0d907f16d5ce3c8722`
- Metadata-clean source input: `assets/photo-sources/classic-kunai.jpg`
- Input SHA-256: `091db23cdc9f942d12aafe1478de6514177b2aa0657da3e30c1ab91f949b602c`
- Handoff: QA branch claude/photo-handoff commit 4cefd25 (classic-kunai-RAV_4322.jpg), SHA-256 verified before import; Drive copy in the owner's HoneyComb folder. Metadata removed with scripts/clean-source.py; decoded pixels verified identical to the original.
- Source dimensions: 4912 × 7360; EXIF orientation 1.
- Applied crop box after orientation: `(627, 1370, 4205, 6142)`.
- Square storefront frame: the whole applied crop centred on a 4772 × 4772 square whose padding repeats the crop edge tones outward (averaged per row or column and smoothed; median backdrop `#ccc6c8`), with a 191 px edge fade. Shows the whole kunai, ring to tip, with a margin.
- Link-preview image: the square storefront frame at 1200 × 1200, baseline JPEG without metadata.

| Output | Resize width | Actual dimensions | Bytes | Quality | Output SHA-256 |
|---|---:|---|---:|---:|---|
| `/assets/classic-kunai-480.webp` | 480 | 480 × 640 | 5208 | 82 | `8b257a95c1941045c9b83df817f15f3c1441e058a0634fa078ae7d1aa6928519` |
| `/assets/classic-kunai-480.avif` | 480 | 480 × 640 | 2718 | AVIF 60 | `364a1afe75b31355ffe6f396735ce159ed0fc8e31054fc0d3e2c4beefd61c06c` |
| `/assets/classic-kunai-960.webp` | 960 | 960 × 1280 | 24286 | 82 | `806ef8226020740e948d744f712445195ab7e357d43c785d776a1547d8170931` |
| `/assets/classic-kunai-960.avif` | 960 | 960 × 1280 | 8643 | AVIF 60 | `f74ea22785ad150cb7f1fdaacc30bdfc63a8b9261cfd36d62e3c90d4f4f7dcea` |
| `/assets/classic-kunai-1440.webp` | 1440 | 1440 × 1921 | 78478 | 82 | `e10e91f8d8793d468cf2563ed0475eeeec60499027bf8dc93dfef8ad19d2c519` |
| `/assets/classic-kunai-1440.avif` | 1440 | 1440 × 1921 | 30137 | AVIF 60 | `fa5d3889d2e56951dfe1a36466f6923873be2536896c1156c0d0770cf42b2a6c` |
| `/assets/classic-kunai-sq-160.webp` | 160 | 160 × 160 | 880 | 82 | `36777924393ca8f0034b9166c38e7d39241b1b1122c1fd1dbfa8406ba6b73c4d` |
| `/assets/classic-kunai-sq-160.avif` | 160 | 160 × 160 | 820 | AVIF 60 | `f580fb85787f5d5b2c478f3d01ce6f5ad9cee17ad4e2f8078a67a94fe0855a03` |
| `/assets/classic-kunai-sq-320.webp` | 320 | 320 × 320 | 1984 | 82 | `0496a54fd6fd7ca523ca989dca6b7cbdc52b69a1c11788bb3f802c5f45b0fea1` |
| `/assets/classic-kunai-sq-320.avif` | 320 | 320 × 320 | 1352 | AVIF 60 | `70d1ee4b3067f84fd3ff2d83ffcae6eb0279ad0744bcfbf9145a3b82430c03cd` |
| `/assets/classic-kunai-sq-480.webp` | 480 | 480 × 480 | 3530 | 82 | `b6f26cb313a0ad0d89f677a1ff292ca5a5f709a9a078127d2c2f797e3618a764` |
| `/assets/classic-kunai-sq-480.avif` | 480 | 480 × 480 | 1996 | AVIF 60 | `5c55298d5e6132d38b5df62d2ffb93c0bdda4ed552735d1cf587c82d870ea50c` |
| `/assets/classic-kunai-sq-640.webp` | 640 | 640 × 640 | 5592 | 82 | `4e7159e8795c2d4153dbf35d4e95982108f261ffa502d840cd2399600aa01512` |
| `/assets/classic-kunai-sq-640.avif` | 640 | 640 × 640 | 2768 | AVIF 60 | `0bd6fd74966d0f04cb3ed0d8662eab4b6beb18dc9306f91994003150640ef657` |
| `/assets/classic-kunai-sq-960.webp` | 960 | 960 × 960 | 11926 | 82 | `4dbed4a9e8a89f3b4dac25e0cae22e6512e375451f45610e3313a01c2af799e9` |
| `/assets/classic-kunai-sq-960.avif` | 960 | 960 × 960 | 5194 | AVIF 60 | `92f2b614708b6a653f3109fb8079cc7f525cd16320f72157d6f179d5144ff348` |
| `/assets/classic-kunai-sq-1200.webp` | 1200 | 1200 × 1200 | 19376 | 82 | `f26de487e3b16b6838e6e35e775e6b8dbedfa0ced4ec50b2680db0367f1557ab` |
| `/assets/classic-kunai-sq-1200.avif` | 1200 | 1200 × 1200 | 7295 | AVIF 60 | `f7a4927d986a180bdd26122831bf687956ec363775070bed897c6ed8b722658e` |
| `/assets/classic-kunai-share.jpg` | 1200 | 1200 × 1200 | 84702 | JPEG 84 | `5ef3e7401105cf6e78a22ac5bc0d84a224e2fcb18ed521dfba688fc057e2c4d8` |

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

None. Kurama and Classic Kunai were imported on 16 October 2026 from the QA handoff branch; both original SHA-256 hashes matched the owner-approved files before import.

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
- svgIcon: {'output': '/favicon.svg', 'method': 'PDF vector paths copied verbatim; full-page clips dropped', 'paths': 25, 'fills': ['#231f20', '#faa31b', '#ffffff'], 'viewBox': [532.114, 534.602, 1900.351, 1900.351], 'background': 'transparent', 'bytes': 8130, 'sha256': '04a20ddb596f0b0df7e7b874b1feedfb5e8eb89cdc52f46db5dc5f14b2a04fcd'}

Crop coordinates refer to the 2x rendered first PDF page. Aspect ratio is preserved on a centered white square. ICO contains 16, 32 and 48 pixel frames; no EXIF/XMP/ICC metadata is copied. The 180 x 180 apple-touch-icon.png renders the same page on transparency, fits the symbol in 136 px and centres it on #0c0b0a. favicon.svg keeps the PDF's own vector paths and fills unchanged (PyMuPDF get_svg_image, text as paths), drops only the full-page clip wrappers, and sets a square viewBox around the artwork on a transparent background; favicon.ico stays as the fallback. Reproduce with python scripts/prepare-favicon.py using Pillow 11.3.0 and PyMuPDF 1.26.5.
