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

## HNYCMB505

- Source title: `HNYCMB505-bridgerton-bookmark.jpg`
- Source Drive ID: `12iD2dbrjeeKNhat0ns5d6ArSze5gSMKE`
- Drive original SHA-256: `f7e859a647dc21012d1168391d6d649a3110e3a3451852f0117296acb8709283`
- Metadata-clean source input: `assets/photo-sources/bridgerton-bookmark.jpg`
- Input SHA-256: `1c79679510a3d9e90af4b78ee39d7a1ba2cbb26a29f2da8a366b44f56a4cdc0a`
- Handoff: QA branch claude/photo-handoff commit fe19da8 (HNYCMB505-bridgerton-bookmark.jpg), SHA-256 verified before import; Drive original in the owner's HoneyComb folder; owner said "list those" on 2026-10-16. Metadata removed with scripts/clean-source.py; decoded pixels verified identical to the original.
- Source dimensions: 1920 × 1581; EXIF orientation 1.
- Applied crop box after orientation: `(90, 0, 1920, 1581)`.
- Square storefront frame: the whole applied crop centred on a 1830 × 1830 square whose padding repeats the crop edge tones outward (averaged per row or column and smoothed; median backdrop `#2b2728`), with a 73 px edge fade. The whole bookmark, tip to cameo, on its black leather backdrop.
- Link-preview image: the square storefront frame at 1200 × 1200, baseline JPEG without metadata.

| Output | Resize width | Actual dimensions | Bytes | Quality | Output SHA-256 |
|---|---:|---|---:|---:|---|
| `/assets/bridgerton-bookmark-480.webp` | 480 | 480 × 415 | 70212 | 82 | `4de09ef2ab0a14835072d543fefb78c1dc49d0447d02b821f6cfbed5bd261687` |
| `/assets/bridgerton-bookmark-480.avif` | 480 | 480 × 415 | 61952 | AVIF 60 | `3dee00cd47985271723b16cdb753ff733d363f4023e731ec6a468679dcf4b529` |
| `/assets/bridgerton-bookmark-960.webp` | 960 | 960 × 829 | 251490 | 82 | `215012fca19554142d7ec9e6b66ba8b19b875809b6d7998addc44e7366b0cd38` |
| `/assets/bridgerton-bookmark-960.avif` | 960 | 960 × 829 | 222313 | AVIF 60 | `b9cbc8f9cf5d7c13476719251dcaf5f48333991a670fb239006fee0d445200e6` |
| `/assets/bridgerton-bookmark-sq-160.webp` | 160 | 160 × 160 | 6060 | 82 | `57e02d2853b20a2d9dce86afdeb972eb5de31b7a696a8271414d5324c42a101f` |
| `/assets/bridgerton-bookmark-sq-160.avif` | 160 | 160 × 160 | 5034 | AVIF 60 | `5a526d447f906d4df535038d772ee7f7781ef6f97e64daff9d3b9e89910783d9` |
| `/assets/bridgerton-bookmark-sq-320.webp` | 320 | 320 × 320 | 28424 | 82 | `aedb1b6ef2cd5967d855d18bf7690fe44c3fa14fb3d8d2c42f790470e3c75840` |
| `/assets/bridgerton-bookmark-sq-320.avif` | 320 | 320 × 320 | 24872 | AVIF 60 | `a4585e49675158fc762bbc52bcde398a9c13ae2b6f2abb808cb3b915a302d5ec` |
| `/assets/bridgerton-bookmark-sq-480.webp` | 480 | 480 × 480 | 65466 | 82 | `565cd145e5b574a8614eb1b5d387ed8af8f9b87cc0f4f4d2d13839f078d2cfbe` |
| `/assets/bridgerton-bookmark-sq-480.avif` | 480 | 480 × 480 | 59231 | AVIF 60 | `a49e20eb8ef432ee9f777acb1c5e9d6993df7de9679ac5b9e15ec95dd8dc63a7` |
| `/assets/bridgerton-bookmark-sq-640.webp` | 640 | 640 × 640 | 114590 | 82 | `81c318ac454e15179c52b184fdb691eebc9d8f6401b35347d23e219feab14455` |
| `/assets/bridgerton-bookmark-sq-640.avif` | 640 | 640 × 640 | 106654 | AVIF 60 | `0d6875aa0db52935f73430ce47d5e041e905289f57b62325a54675f9a9e43716` |
| `/assets/bridgerton-bookmark-sq-960.webp` | 960 | 960 × 960 | 232554 | 82 | `972566933806a0b764576f42928a2d28754f2fbca078ef537fd4d9a2946842bb` |
| `/assets/bridgerton-bookmark-sq-960.avif` | 960 | 960 × 960 | 210772 | AVIF 60 | `78e8849b2b5772140f68d20578d8f98cf8072a6a6b3e2a6cf22499100a693710` |
| `/assets/bridgerton-bookmark-sq-1200.webp` | 1200 | 1200 × 1200 | 330212 | 82 | `f71a45f31ba7a0905b35386b11f5b066a1e52d0fd24bf7585bfb6acb8a7571aa` |
| `/assets/bridgerton-bookmark-sq-1200.avif` | 1200 | 1200 × 1200 | 289273 | AVIF 60 | `ca9199bc74a235182c49bf78164fe837a15025014d7b16394bab393ac3677083` |
| `/assets/bridgerton-bookmark-share.jpg` | 1200 | 1200 × 1200 | 279641 | JPEG 66 | `a50b41185959bb81c4f2ecd3e4eef0aee67caf6da46d2f0a1ed3c6be4e9a89f4` |

## HNYCMB506

- Source title: `HNYCMB506-flexi-derpy.jpg`
- Source Drive ID: `1xKvveU7RYKISIkPpaq1ZqP3rSQPEzLZa`
- Drive original SHA-256: `2e329ecfaccae167f3a1ab4bebba2577c2666cd6bc43d9837a71c450db7cfd34`
- Metadata-clean source input: `assets/photo-sources/flexi-derpy.jpg`
- Input SHA-256: `6d2d0fdc9dc0c88901a7bcb3ec11a7543d653f41e23ba9b47cfb936d805f5f0d`
- Handoff: QA branch claude/photo-handoff commit fe19da8 (HNYCMB506-flexi-derpy.jpg), SHA-256 verified before import; Drive original in the owner's HoneyComb folder; owner said "list those" on 2026-10-16. Metadata removed with scripts/clean-source.py; decoded pixels verified identical to the original.
- Source dimensions: 1920 × 2560; EXIF orientation 1.
- Applied crop box after orientation: `(300, 640, 1560, 1900)`.
- Square storefront frame (inside the applied crop): `(300, 640, 1560, 1900)`. The Derpy figures without the basket rim.
- Link-preview image: the square storefront frame at 1200 × 1200, baseline JPEG without metadata.

| Output | Resize width | Actual dimensions | Bytes | Quality | Output SHA-256 |
|---|---:|---|---:|---:|---|
| `/assets/flexi-derpy-480.webp` | 480 | 480 × 480 | 46210 | 82 | `89ccc84c5b2bb936656bdd7ceb420e0a28ae4a39bdd45997cbe7b6cc7ac0b30f` |
| `/assets/flexi-derpy-480.avif` | 480 | 480 × 480 | 37044 | AVIF 60 | `5a415ad234f7bbed5d710d2e2f3bf9f2ec0108e9e254e07f2826a3f5d5a882f1` |
| `/assets/flexi-derpy-960.webp` | 960 | 960 × 960 | 117042 | 82 | `cebd17ed736467567f8f3a4c1d2d9d532271848d65c9948c74478e20530b68a9` |
| `/assets/flexi-derpy-960.avif` | 960 | 960 × 960 | 83012 | AVIF 60 | `989223f321205480c46b218f3547a51b9bdba523c1d890e0a171d167cc0b45c6` |
| `/assets/flexi-derpy-sq-160.webp` | 160 | 160 × 160 | 9880 | 82 | `0eb5b577ca52535041368e968be557d274c6900d38831ecef5f130da034f32e9` |
| `/assets/flexi-derpy-sq-160.avif` | 160 | 160 × 160 | 8841 | AVIF 60 | `264481a4e8a8284388dfb3bea8cf6083a19b23db5bc9796583ca63c5aee4bd7e` |
| `/assets/flexi-derpy-sq-320.webp` | 320 | 320 × 320 | 25830 | 82 | `946167de8df9db0b4526436b2fddb5602def59f12165c2120c2bc73d9a006259` |
| `/assets/flexi-derpy-sq-320.avif` | 320 | 320 × 320 | 22112 | AVIF 60 | `823a29e53f3fade96dbdc18e608993bbc7a2ee4b528a681fa167da3b5960c4f4` |
| `/assets/flexi-derpy-sq-480.webp` | 480 | 480 × 480 | 46210 | 82 | `89ccc84c5b2bb936656bdd7ceb420e0a28ae4a39bdd45997cbe7b6cc7ac0b30f` |
| `/assets/flexi-derpy-sq-480.avif` | 480 | 480 × 480 | 37044 | AVIF 60 | `5a415ad234f7bbed5d710d2e2f3bf9f2ec0108e9e254e07f2826a3f5d5a882f1` |
| `/assets/flexi-derpy-sq-640.webp` | 640 | 640 × 640 | 69626 | 82 | `3d9b1780ce6f9df49480f96e3c4539fc98580c54a7dc9d9c5002914222c0730c` |
| `/assets/flexi-derpy-sq-640.avif` | 640 | 640 × 640 | 52860 | AVIF 60 | `063b81ad83706e0116bf0fefcede4b66d9276fa2db09f57796a5f52ae3110192` |
| `/assets/flexi-derpy-sq-960.webp` | 960 | 960 × 960 | 117042 | 82 | `cebd17ed736467567f8f3a4c1d2d9d532271848d65c9948c74478e20530b68a9` |
| `/assets/flexi-derpy-sq-960.avif` | 960 | 960 × 960 | 83012 | AVIF 60 | `989223f321205480c46b218f3547a51b9bdba523c1d890e0a171d167cc0b45c6` |
| `/assets/flexi-derpy-sq-1200.webp` | 1200 | 1200 × 1200 | 158268 | 82 | `46f465386967b6b8a9d83dd9bf0fe26c2864d67c73555d6671da689227e82c2a` |
| `/assets/flexi-derpy-sq-1200.avif` | 1200 | 1200 × 1200 | 105420 | AVIF 60 | `70a366ffe8ba9fac34c95c8a0abbb6dcb061db37c5e3f8842ff63e679d61cb7b` |
| `/assets/flexi-derpy-share.jpg` | 1200 | 1200 × 1200 | 271677 | JPEG 84 | `bb9750d9eeb5e5c7a4ed2e0874a207fdedf7763474397de71cb350a99efce2fc` |

## HNYCMB507

- Source title: `HNYCMB507-desk-organizer.jpg`
- Source Drive ID: `1vmZYNsrB7_JkNByGhegptecoZoPbLmqg`
- Drive original SHA-256: `6ad682b24ca487a50394bd5b7e5f1382f192347f0bad47fff55a2d0a748b6b92`
- Metadata-clean source input: `assets/photo-sources/desk-organizer.jpg`
- Input SHA-256: `00a7ae74f2ee0519820bc81a766d0b3b3dd7a83fc2238529c8cafae5f794ee45`
- Handoff: QA branch claude/photo-handoff commit fe19da8 (HNYCMB507-desk-organizer.jpg), SHA-256 verified before import; Drive original in the owner's HoneyComb folder; owner said "list those" on 2026-10-16. Metadata removed with scripts/clean-source.py; decoded pixels verified identical to the original.
- Source dimensions: 4608 × 3456; EXIF orientation 6.
- Applied crop box after orientation: `(0, 1050, 3456, 4506)`.
- Square storefront frame (inside the applied crop): `(0, 1050, 3456, 4506)`. The whole organizer, framed low to leave out the printer behind it.
- Link-preview image: the square storefront frame at 1200 × 1200, baseline JPEG without metadata.

| Output | Resize width | Actual dimensions | Bytes | Quality | Output SHA-256 |
|---|---:|---|---:|---:|---|
| `/assets/desk-organizer-480.webp` | 480 | 480 × 480 | 30176 | 82 | `4bfa1e6de2163d4f71e4c6281a9a4d1d2e27678a0a958ffffb044fd4d5cc1b2c` |
| `/assets/desk-organizer-480.avif` | 480 | 480 × 480 | 21086 | AVIF 60 | `dffc23551b2282bff5a91130c3372fc7748682611d3a17d638f3f109c765719f` |
| `/assets/desk-organizer-960.webp` | 960 | 960 × 960 | 91422 | 82 | `96e7fdc3607f5a517646d8a33f6a43c2bc018de70e4a630a2d9ba8eb909186b7` |
| `/assets/desk-organizer-960.avif` | 960 | 960 × 960 | 62129 | AVIF 60 | `d123dd412dabe1dba4a30e29b0302595e35af6efde5e2e54180834f76cbd0b6b` |
| `/assets/desk-organizer-sq-160.webp` | 160 | 160 × 160 | 4516 | 82 | `663acb234c98a933a4196ffd4d99005ef5051f2540ae37430bc2de8c3d0c9e55` |
| `/assets/desk-organizer-sq-160.avif` | 160 | 160 × 160 | 3277 | AVIF 60 | `491d5fe9f449f64fbfc8b49c5c561467867272201a436927790267706d40026b` |
| `/assets/desk-organizer-sq-320.webp` | 320 | 320 × 320 | 15040 | 82 | `e8021fafd11ac773bb4dbce7e8f63bc77eb96980b12da3ce045c059bf0f0db10` |
| `/assets/desk-organizer-sq-320.avif` | 320 | 320 × 320 | 10687 | AVIF 60 | `360df7c391beb8519ff566a61c575333573f51123ac3fdbf8b414cafb9b03ac6` |
| `/assets/desk-organizer-sq-480.webp` | 480 | 480 × 480 | 30176 | 82 | `4bfa1e6de2163d4f71e4c6281a9a4d1d2e27678a0a958ffffb044fd4d5cc1b2c` |
| `/assets/desk-organizer-sq-480.avif` | 480 | 480 × 480 | 21086 | AVIF 60 | `dffc23551b2282bff5a91130c3372fc7748682611d3a17d638f3f109c765719f` |
| `/assets/desk-organizer-sq-640.webp` | 640 | 640 × 640 | 47816 | 82 | `db5ffe4bb9d0ac560151a35c5218e0397449adb22eedfeaea7e75fc25eada65e` |
| `/assets/desk-organizer-sq-640.avif` | 640 | 640 × 640 | 34218 | AVIF 60 | `d6af25b0597b5cb60ef722c10db06c674f55b64adb7343ad7f07a38a7ba81cc8` |
| `/assets/desk-organizer-sq-960.webp` | 960 | 960 × 960 | 91422 | 82 | `96e7fdc3607f5a517646d8a33f6a43c2bc018de70e4a630a2d9ba8eb909186b7` |
| `/assets/desk-organizer-sq-960.avif` | 960 | 960 × 960 | 62129 | AVIF 60 | `d123dd412dabe1dba4a30e29b0302595e35af6efde5e2e54180834f76cbd0b6b` |
| `/assets/desk-organizer-sq-1200.webp` | 1200 | 1200 × 1200 | 129228 | 82 | `b5bca12032acb712d2c3398f8888f660ed7f9fb6f69881eb61ecc6909b31e6b7` |
| `/assets/desk-organizer-sq-1200.avif` | 1200 | 1200 × 1200 | 87026 | AVIF 60 | `f7591d94c917cf8c8200e6b5b86dcd3e2453621b269af7f3447a849a8a4c71ed` |
| `/assets/desk-organizer-share.jpg` | 1200 | 1200 × 1200 | 224829 | JPEG 84 | `a889ca7446625968eaee063cb3c685faf95c3d14ca01cecb54972ab558c10d67` |

## HNYCMB510

- Source title: `HNYCMB510-light-fury-big-wings.jpg`
- Source Drive ID: `1KQeczUTxcbbVstTYWVDgL6epTOeyWqsF`
- Drive original SHA-256: `cdb3293ee1faa7d75e67a520b87842ecbb6371d915b884d2523fe1e7662e461e`
- Metadata-clean source input: `assets/photo-sources/light-fury-big-wings.jpg`
- Input SHA-256: `bf34ba465b80c3fd68413d8af1ae4522bbcd9c09bf6a0029d374051456c57b84`
- Handoff: QA branch claude/photo-handoff commit fe19da8 (HNYCMB510-light-fury-big-wings.jpg), SHA-256 verified before import; Drive original in the owner's HoneyComb folder; owner said "list those" on 2026-10-16. Metadata removed with scripts/clean-source.py; decoded pixels verified identical to the original.
- Source dimensions: 3264 × 2448; EXIF orientation 1.
- Applied crop box after orientation: `(80, 0, 3264, 2448)`.
- Square storefront frame: the whole applied crop centred on a 3184 × 3184 square whose padding repeats the crop edge tones outward (averaged per row or column and smoothed; median backdrop `#0a1016`), with a 127 px edge fade. The whole dragon, wing tip to tail, on its dark fabric.
- Link-preview image: the square storefront frame at 1200 × 1200, baseline JPEG without metadata.

| Output | Resize width | Actual dimensions | Bytes | Quality | Output SHA-256 |
|---|---:|---|---:|---:|---|
| `/assets/light-fury-big-wings-480.webp` | 480 | 480 × 369 | 38814 | 82 | `3ef527a695c3c85bd325b9a8d3ee4f1adc415744e5272506e5a6b34779061636` |
| `/assets/light-fury-big-wings-480.avif` | 480 | 480 × 369 | 31969 | AVIF 60 | `2d7a40e4d7cacbcd3da7f2c87235c54c2afeb96a51eb0824e461dffe3fd4b895` |
| `/assets/light-fury-big-wings-960.webp` | 960 | 960 × 738 | 112102 | 82 | `25744f78a49a8a0d575cbf758b837a2192d1b35c9ed6216d449a6e901b297bdc` |
| `/assets/light-fury-big-wings-960.avif` | 960 | 960 × 738 | 78053 | AVIF 60 | `5e8746be021ce29ef87ad3069d7fb29ab43f59c58b095542e6d25c8f329dac31` |
| `/assets/light-fury-big-wings-sq-160.webp` | 160 | 160 × 160 | 4192 | 82 | `93a28abedd609eab812e5fc7016866922ad5a74d807ec574a061b4fd12186eae` |
| `/assets/light-fury-big-wings-sq-160.avif` | 160 | 160 × 160 | 3881 | AVIF 60 | `5bc5e97e8a05350bef4d3c3157f354360de26649647cd06cdb16d709efa055be` |
| `/assets/light-fury-big-wings-sq-320.webp` | 320 | 320 × 320 | 16048 | 82 | `928575b85a4812e3b8bb7a5d404baf1b6d681368bc676bbae0d28bb1be1d81e7` |
| `/assets/light-fury-big-wings-sq-320.avif` | 320 | 320 × 320 | 14270 | AVIF 60 | `531729ecfcdd7d85e099710827bc9e545550e608833ebb6438c6adcfcfee6405` |
| `/assets/light-fury-big-wings-sq-480.webp` | 480 | 480 × 480 | 36688 | 82 | `4325ca6d3547e2b2f11e48e370c72df6dbbfd052e80b0c779c513da7e118f99a` |
| `/assets/light-fury-big-wings-sq-480.avif` | 480 | 480 × 480 | 30371 | AVIF 60 | `07d3292c7a30a1b69106b6870db1808ea1c45a923c3f6671ecfc3cdf85f5c9cd` |
| `/assets/light-fury-big-wings-sq-640.webp` | 640 | 640 × 640 | 59394 | 82 | `a09852d3f9dba4020462e6073239987663cc073a8623f791811f19f1f4271370` |
| `/assets/light-fury-big-wings-sq-640.avif` | 640 | 640 × 640 | 47708 | AVIF 60 | `77be32fc84db2371b9d15f6584a20dbd84e974791b7c9012408190e1495b62ff` |
| `/assets/light-fury-big-wings-sq-960.webp` | 960 | 960 × 960 | 105590 | 82 | `94a1dcaf9b0b2bc892b1fda670175c6b413b0f03abde0d07292fd7c48f496efa` |
| `/assets/light-fury-big-wings-sq-960.avif` | 960 | 960 × 960 | 73974 | AVIF 60 | `b0e50cd8bea4a4b9dc5a59a882b21440033ea7acc05eb67dae8ecf40dd8a6cb0` |
| `/assets/light-fury-big-wings-sq-1200.webp` | 1200 | 1200 × 1200 | 137616 | 82 | `6ea0654254fc435beff75a42120c420afaf6b1b10f2caf520b32edb0dd4d6c34` |
| `/assets/light-fury-big-wings-sq-1200.avif` | 1200 | 1200 × 1200 | 90502 | AVIF 60 | `d112aaf1773f9e992e0855c8abbb3d1f863cdc18eefb3cf30b9ab6c17586a71f` |
| `/assets/light-fury-big-wings-share.jpg` | 1200 | 1200 × 1200 | 212878 | JPEG 84 | `fd9ed8d63441982f8dfb1e7db3e8780bfabcd003b3aaf0efc254180ecf46573c` |

## HNYCMB512

- Source title: `HNYCMB512-urban-spider-man.jpg`
- Source Drive ID: `120w4276bAIJL7o9LX3m2SSlXjDW9qs53`
- Drive original SHA-256: `8978e4307d61023d802dd213ce20e9e6601df22186396ed04903599c4739f7eb`
- Metadata-clean source input: `assets/photo-sources/urban-spider-man.jpg`
- Input SHA-256: `ed5e48f8ef92d64fac025b1da2513ebe40880621aec9da68086cbfe68cd463d7`
- Handoff: QA branch claude/photo-handoff commit fe19da8 (HNYCMB512-urban-spider-man.jpg), SHA-256 verified before import; Drive original in the owner's HoneyComb folder; owner said "list those" on 2026-10-16. Metadata removed with scripts/clean-source.py; decoded pixels verified identical to the original.
- Source dimensions: 1920 × 2560; EXIF orientation 1.
- Applied crop box after orientation: `(0, 180, 1920, 2300)`.
- Square storefront frame: the whole applied crop centred on a 2120 × 2120 square whose padding repeats the crop edge tones outward (averaged per row or column and smoothed; median backdrop `#683a12`), with a 85 px edge fade. The whole figure, hood to sneakers.
- Link-preview image: the square storefront frame at 1200 × 1200, baseline JPEG without metadata.

| Output | Resize width | Actual dimensions | Bytes | Quality | Output SHA-256 |
|---|---:|---|---:|---:|---|
| `/assets/urban-spider-man-480.webp` | 480 | 480 × 530 | 33728 | 82 | `be3091a7cd19b532b40669366188b803a1d30bad0044b4bbc0461c01b80aa604` |
| `/assets/urban-spider-man-480.avif` | 480 | 480 × 530 | 23725 | AVIF 60 | `e2f0c8ce138daffa907a2e84d01f3909b848d9423000d5ae83c10920cb6d70ce` |
| `/assets/urban-spider-man-960.webp` | 960 | 960 × 1060 | 86984 | 82 | `5ec74535e9a292cb7a45c57d434f14085523334f3b907e432262a7ae4a254430` |
| `/assets/urban-spider-man-960.avif` | 960 | 960 × 1060 | 52153 | AVIF 60 | `dd5e36e345b4c22766c7ebb77dc47f183401f78128a19810e21307fdf6fad3d9` |
| `/assets/urban-spider-man-sq-160.webp` | 160 | 160 × 160 | 5814 | 82 | `3e6e7364aa4f51ddcbfd6f1d8e3681dc9b1d68d3732e3a145b5b7742d2c75ba3` |
| `/assets/urban-spider-man-sq-160.avif` | 160 | 160 × 160 | 4849 | AVIF 60 | `0a2199a278cd757216673ee2d1e642d8d29dd1b0b815da7bd4e4e49b4adafcba` |
| `/assets/urban-spider-man-sq-320.webp` | 320 | 320 × 320 | 16560 | 82 | `2d9fe615408fb3062514742484c4c4026b6a9c4afd2779934bb61cb35a49215f` |
| `/assets/urban-spider-man-sq-320.avif` | 320 | 320 × 320 | 12368 | AVIF 60 | `fbdc7ae5a1ae4668e9613f42c7ee4cfe9aca28c24ba8be06c9c8681aecd9a05e` |
| `/assets/urban-spider-man-sq-480.webp` | 480 | 480 × 480 | 28696 | 82 | `567cdcdb05a891424ae6e6ca4ba02b468dc492ee4511ed5ca2048b3b7b00d3b4` |
| `/assets/urban-spider-man-sq-480.avif` | 480 | 480 × 480 | 20359 | AVIF 60 | `5dd2bbdfe292b18cdd16e8aa8d664b03d739aea7921419ac0ad04d0712d246bc` |
| `/assets/urban-spider-man-sq-640.webp` | 640 | 640 × 640 | 41848 | 82 | `c48c30952cf1f277fd757f55f530eb295ce6e3cd8ffbc2ba910b1aedac5010fd` |
| `/assets/urban-spider-man-sq-640.avif` | 640 | 640 × 640 | 28855 | AVIF 60 | `8dc88ab2cf2e7b1f6db07b00856b1e7eee9ead551ed8a11878144a8230c563ff` |
| `/assets/urban-spider-man-sq-960.webp` | 960 | 960 × 960 | 72182 | 82 | `732dea6bbfa6d2a534771623119b561f8d8c2f93968acc18bc734f78541d62d9` |
| `/assets/urban-spider-man-sq-960.avif` | 960 | 960 × 960 | 44474 | AVIF 60 | `154d2ae90bc1beffc03dc9f664468357ee126c7a1206e164edc47c9c1c5c914e` |
| `/assets/urban-spider-man-sq-1200.webp` | 1200 | 1200 × 1200 | 98266 | 82 | `374b98e951c77198e6d31187ea3a95e6a499a996e3f0f2cb7e2db9e9a9c68ac4` |
| `/assets/urban-spider-man-sq-1200.avif` | 1200 | 1200 × 1200 | 58558 | AVIF 60 | `d61ad2b69eabc1de36cc4d4559c69283dbc7c4c76557d17f8caf3db453b66a9f` |
| `/assets/urban-spider-man-share.jpg` | 1200 | 1200 × 1200 | 191038 | JPEG 84 | `50fadd10f993bd05b88c0113e36ec68315873386b64d2e652d8679e5ba9192e1` |

## HNYCMB514

- Source title: `HNYCMB514-shuriken.jpg`
- Source Drive ID: `1vlDR1GAuyCUVawoikmyb6-IDCmg0J62Q`
- Drive original SHA-256: `17e2e2cd44ecd9bc9bc8df6684fec4760bfbe6d85346151691ca13935f67ac4e`
- Metadata-clean source input: `assets/photo-sources/shuriken.jpg`
- Input SHA-256: `21766fcaa5d766f36e874c1382b779e6c96e30e974162671ea06fd3fbcdbb878`
- Handoff: QA branch claude/photo-handoff commit fe19da8 (HNYCMB514-shuriken.jpg), SHA-256 verified before import; Drive original in the owner's HoneyComb folder; owner said "list those" on 2026-10-16. Metadata removed with scripts/clean-source.py; decoded pixels verified identical to the original.
- Source dimensions: 2736 × 3648; EXIF orientation 1.
- Applied crop box after orientation: `(400, 790, 2470, 2860)`.
- Square storefront frame (inside the applied crop): `(400, 790, 2470, 2860)`. The whole star; only the fingertips holding it remain, the box edges are cut.
- Link-preview image: the square storefront frame at 1200 × 1200, baseline JPEG without metadata.

| Output | Resize width | Actual dimensions | Bytes | Quality | Output SHA-256 |
|---|---:|---|---:|---:|---|
| `/assets/shuriken-480.webp` | 480 | 480 × 480 | 10598 | 82 | `ac619be0253f84318d54ddef3542835b8878e9d0e5a83ad6b573ef2345f0429e` |
| `/assets/shuriken-480.avif` | 480 | 480 × 480 | 6383 | AVIF 60 | `b44819a5ce011f22399039de5e75f0372aac85b18b7b02099de8663ac626f9a4` |
| `/assets/shuriken-960.webp` | 960 | 960 × 960 | 26752 | 82 | `2e5fb950399b9e772513d4cd3328cca8686768f0188f539284c93a459bbb0c73` |
| `/assets/shuriken-960.avif` | 960 | 960 × 960 | 13587 | AVIF 60 | `22c930ef74c44c5c95c767cbeea517a6a6a8af32884f9568441ff5d7e66266a6` |
| `/assets/shuriken-sq-160.webp` | 160 | 160 × 160 | 2838 | 82 | `cfad9ee5ea242c052fab746e2d1ace71ed8dd0dba29053806aa5f92da85632f3` |
| `/assets/shuriken-sq-160.avif` | 160 | 160 × 160 | 2302 | AVIF 60 | `a1185d1df98e8c18bc29066981795f2aa33d2a2e1fee56d188cb44a5db0398da` |
| `/assets/shuriken-sq-320.webp` | 320 | 320 × 320 | 6420 | 82 | `e43600ffa45984f20889316fbb250c622e95a685813043596f57bb09f078940b` |
| `/assets/shuriken-sq-320.avif` | 320 | 320 × 320 | 4280 | AVIF 60 | `6272e1daae7c65edc70beb9988fa109e5223d93bdcd65f2e20dad0dbf55e32a7` |
| `/assets/shuriken-sq-480.webp` | 480 | 480 × 480 | 10598 | 82 | `ac619be0253f84318d54ddef3542835b8878e9d0e5a83ad6b573ef2345f0429e` |
| `/assets/shuriken-sq-480.avif` | 480 | 480 × 480 | 6383 | AVIF 60 | `b44819a5ce011f22399039de5e75f0372aac85b18b7b02099de8663ac626f9a4` |
| `/assets/shuriken-sq-640.webp` | 640 | 640 × 640 | 15312 | 82 | `d26a74c6a9bc85e200e5c2d50743515bf14b74dc2c81496e693793e0f38c0446` |
| `/assets/shuriken-sq-640.avif` | 640 | 640 × 640 | 8641 | AVIF 60 | `b88d56c533faf4c7c8e5329c2adfbe37a207558c7f74dc0019a423ba60c83484` |
| `/assets/shuriken-sq-960.webp` | 960 | 960 × 960 | 26752 | 82 | `2e5fb950399b9e772513d4cd3328cca8686768f0188f539284c93a459bbb0c73` |
| `/assets/shuriken-sq-960.avif` | 960 | 960 × 960 | 13587 | AVIF 60 | `22c930ef74c44c5c95c767cbeea517a6a6a8af32884f9568441ff5d7e66266a6` |
| `/assets/shuriken-sq-1200.webp` | 1200 | 1200 × 1200 | 37880 | 82 | `ffffe0768b1885c7baf9a5a05bb752ff3fc1c218ced7c574bd0654cffe88b92b` |
| `/assets/shuriken-sq-1200.avif` | 1200 | 1200 × 1200 | 17496 | AVIF 60 | `48b834b6807a655346246fa91403b38aa038299571d6a3193a86544bdb364207` |
| `/assets/shuriken-share.jpg` | 1200 | 1200 × 1200 | 110461 | JPEG 84 | `db884b7aa4202d68633958ff918dbafb8b31fadadb1f5fdeab253cad182184c9` |

## HNYCMB515

- Source title: `HNYCMB515-grogu-keychain.jpg`
- Source Drive ID: `1OL98LhZBjTEKJ8swbXjxrEzVQFJqa2iN`
- Drive original SHA-256: `2d4c5b10d455750c9e27f51e1146dcf43b37ce5558696fd360c66e3cac32b7eb`
- Metadata-clean source input: `assets/photo-sources/grogu-keychain.jpg`
- Input SHA-256: `ed1aa1466287a31fbc59a4b564155eb7e0cf77947f2bd28802cd5422d71d2553`
- Handoff: QA branch claude/photo-handoff commit fe19da8 (HNYCMB515-grogu-keychain.jpg), SHA-256 verified before import; Drive original in the owner's HoneyComb folder; owner said "list those" on 2026-10-16. Metadata removed with scripts/clean-source.py; decoded pixels verified identical to the original.
- Source dimensions: 3024 × 4032; EXIF orientation 1.
- Applied crop box after orientation: `(605, 1075, 2505, 2975)`.
- Square storefront frame (inside the applied crop): `(605, 1075, 2505, 2975)`. The whole keychain, ring included.
- Link-preview image: the square storefront frame at 1200 × 1200, baseline JPEG without metadata.

| Output | Resize width | Actual dimensions | Bytes | Quality | Output SHA-256 |
|---|---:|---|---:|---:|---|
| `/assets/grogu-keychain-480.webp` | 480 | 480 × 480 | 25230 | 82 | `7d50afc20826162ebc3eb24f511d3304dbbed3c33feaae84991b8091de6f10e7` |
| `/assets/grogu-keychain-480.avif` | 480 | 480 × 480 | 18331 | AVIF 60 | `b7981d23260ddcc94f78728f04e5e47f268ff95763c04ebd3640de93ee4e2a08` |
| `/assets/grogu-keychain-960.webp` | 960 | 960 × 960 | 59008 | 82 | `c2c90f2b6aec2331838bef342b96888bf9453edb3230365ba1ef0c94184b095b` |
| `/assets/grogu-keychain-960.avif` | 960 | 960 × 960 | 36861 | AVIF 60 | `4f8114ccd306ade2f43bfe0b92d6bd0d243b4e7e3a23cc736a78236dea8b8a47` |
| `/assets/grogu-keychain-sq-160.webp` | 160 | 160 × 160 | 4470 | 82 | `8f9c60bafb0af07e8d2496130fa14a151843cc67b94c892a03442c6ac93bbb8f` |
| `/assets/grogu-keychain-sq-160.avif` | 160 | 160 × 160 | 3918 | AVIF 60 | `ddda76aad52050f23e549ccfcf195fd9dc6ceac232626fe8253139a2f6f0ae2f` |
| `/assets/grogu-keychain-sq-320.webp` | 320 | 320 × 320 | 14122 | 82 | `3294dc5774829c7a19ce2109676d7b9c6316b77609934b5d6f528a3292fb5bd5` |
| `/assets/grogu-keychain-sq-320.avif` | 320 | 320 × 320 | 10948 | AVIF 60 | `79969b01dc3df41dfc8d40f05b3cdcc240ce4475cadb054e5b6113628ff1912d` |
| `/assets/grogu-keychain-sq-480.webp` | 480 | 480 × 480 | 25230 | 82 | `7d50afc20826162ebc3eb24f511d3304dbbed3c33feaae84991b8091de6f10e7` |
| `/assets/grogu-keychain-sq-480.avif` | 480 | 480 × 480 | 18331 | AVIF 60 | `b7981d23260ddcc94f78728f04e5e47f268ff95763c04ebd3640de93ee4e2a08` |
| `/assets/grogu-keychain-sq-640.webp` | 640 | 640 × 640 | 35876 | 82 | `d4c78341894be18f90fd6a933ce83c7568cdba62a0153e2c20488852bc410996` |
| `/assets/grogu-keychain-sq-640.avif` | 640 | 640 × 640 | 25181 | AVIF 60 | `e761e2669b32ae34c736eb4999f48d0f60537234f234275a7387f9626f2d928b` |
| `/assets/grogu-keychain-sq-960.webp` | 960 | 960 × 960 | 59008 | 82 | `c2c90f2b6aec2331838bef342b96888bf9453edb3230365ba1ef0c94184b095b` |
| `/assets/grogu-keychain-sq-960.avif` | 960 | 960 × 960 | 36861 | AVIF 60 | `4f8114ccd306ade2f43bfe0b92d6bd0d243b4e7e3a23cc736a78236dea8b8a47` |
| `/assets/grogu-keychain-sq-1200.webp` | 1200 | 1200 × 1200 | 76468 | 82 | `13d124e446692b35ca909bf3b0b37b59b2d9d73a4cf71bb7b23e3eb61a4c2eea` |
| `/assets/grogu-keychain-sq-1200.avif` | 1200 | 1200 × 1200 | 45068 | AVIF 60 | `253559225a3e804fefc6b11a2d6cd07da796bada7ba566d1ae75642731ffc90f` |
| `/assets/grogu-keychain-share.jpg` | 1200 | 1200 × 1200 | 169854 | JPEG 84 | `5eeaab9ae8dc92a3f1cc28b42f42673625023a16b563a6c9cc6b363faa9bf022` |

## HNYCMB516

- Source title: `HNYCMB516-dummy13-iron-man.jpg`
- Source Drive ID: `1o6V86ZMTo3Syo0Jom4cXwqGGflYVc98a`
- Drive original SHA-256: `8754c67c2808981032178fe165aab49aa9fe20eff72f95850f529c1a7fc03641`
- Metadata-clean source input: `assets/photo-sources/dummy-13-iron-man.jpg`
- Input SHA-256: `74d2bd9e740761a7af4e9248bb07dd427ea812775592a7f1d86e76d2f6d7ca2c`
- Handoff: QA branch claude/photo-handoff commit fe19da8 (HNYCMB516-dummy13-iron-man.jpg), SHA-256 verified before import; Drive original in the owner's HoneyComb folder; owner said "list those" on 2026-10-16. Metadata removed with scripts/clean-source.py; decoded pixels verified identical to the original.
- Source dimensions: 1398 × 2603; EXIF orientation 1.
- Applied crop box after orientation: `(0, 180, 1398, 2603)`.
- Square storefront frame: the whole applied crop centred on a 2423 × 2423 square whose padding repeats the crop edge tones outward (averaged per row or column and smoothed; median backdrop `#6d6d66`), with a 97 px edge fade. The whole figure, hands to feet, with the carpet above its head cut away.
- Link-preview image: the square storefront frame at 1200 × 1200, baseline JPEG without metadata.

| Output | Resize width | Actual dimensions | Bytes | Quality | Output SHA-256 |
|---|---:|---|---:|---:|---|
| `/assets/dummy-13-iron-man-480.webp` | 480 | 480 × 832 | 42026 | 82 | `aadc2248e4ff7941eb9341605f82441bc76fedf1e7e611849d8e231336a3f40f` |
| `/assets/dummy-13-iron-man-480.avif` | 480 | 480 × 832 | 25820 | AVIF 60 | `7f841e0761c323d7bec28c09aa460cf15a091cb2b4695d0dca619753d4a45daa` |
| `/assets/dummy-13-iron-man-960.webp` | 960 | 960 × 1664 | 143884 | 82 | `1e27bc62651ec6dfa7e0c34ca30ff0971721c7afd686ac2d4a05af22b86d73dc` |
| `/assets/dummy-13-iron-man-960.avif` | 960 | 960 × 1664 | 82258 | AVIF 60 | `726fe6146c49a036ea32849bf4bae2186963181b9e16d5f519b3a71818fc2359` |
| `/assets/dummy-13-iron-man-sq-160.webp` | 160 | 160 × 160 | 4194 | 82 | `b2c197db382ff51e730adf8f4f2576c93652a956eab9be152bb1dc00a68b808b` |
| `/assets/dummy-13-iron-man-sq-160.avif` | 160 | 160 × 160 | 3831 | AVIF 60 | `ca2943a248373aff0a238337b5006800aec78a46bd1c21147eba0452a8ef843b` |
| `/assets/dummy-13-iron-man-sq-320.webp` | 320 | 320 × 320 | 11488 | 82 | `5456b769d1c518020ccde07c462e6274dec3d4a8baebb305f62fbfa7c3b73b4d` |
| `/assets/dummy-13-iron-man-sq-320.avif` | 320 | 320 × 320 | 9170 | AVIF 60 | `ee0b76584269513775e6ec6b576935ceedd55b187db042151f67360365f042c2` |
| `/assets/dummy-13-iron-man-sq-480.webp` | 480 | 480 × 480 | 18418 | 82 | `784000c284f2641753762ff8d4cce244058f1936018a5a87d6d22290ee812e3b` |
| `/assets/dummy-13-iron-man-sq-480.avif` | 480 | 480 × 480 | 13627 | AVIF 60 | `f14cfec476b9ac85912334a8289e7bee9822a840bf52da52c4c427530cb8da58` |
| `/assets/dummy-13-iron-man-sq-640.webp` | 640 | 640 × 640 | 25800 | 82 | `9a1c05cead9eda41c3aa2fb19f99fb0b6f44373d029661e500f02a5046b11434` |
| `/assets/dummy-13-iron-man-sq-640.avif` | 640 | 640 × 640 | 18354 | AVIF 60 | `c1b017804cd61eaee11ca7df826fe188e02a292684d3abbb1c3f1ed79afd04d3` |
| `/assets/dummy-13-iron-man-sq-960.webp` | 960 | 960 × 960 | 44136 | 82 | `9e2b059e71b6aa51727cb17f90a6dabb09abcec19d3ca55bf24a2257da6911f6` |
| `/assets/dummy-13-iron-man-sq-960.avif` | 960 | 960 × 960 | 27528 | AVIF 60 | `168bb70aed75dae3378d512a76b777e6d695ee9932e8ef71d28f48dab806c030` |
| `/assets/dummy-13-iron-man-sq-1200.webp` | 1200 | 1200 × 1200 | 62754 | 82 | `61407093adb17b9895144007acbff4a09eb52cf11f00ed09aa386e5f01b7fde5` |
| `/assets/dummy-13-iron-man-sq-1200.avif` | 1200 | 1200 × 1200 | 36605 | AVIF 60 | `fa647196efb8ace353958cbde649fe631dabfb2a5f22a65590a98b4c883a701d` |
| `/assets/dummy-13-iron-man-share.jpg` | 1200 | 1200 × 1200 | 144338 | JPEG 84 | `69c06d4df8f0609c4b7a2dabcb77ae4eb79dd521ebf1a1183859b1ef6b6d5a6c` |

## HNYCMB517

- Source title: `HNYCMB517-dummy13-spider-man.jpg`
- Source Drive ID: `1TcA-A9JgUxGpfvv4Jff77SavaMoKTBMi`
- Drive original SHA-256: `6512bc5d620a1a8a4e9e353ef0ab2b3a6335d8ebdb336b47d3d26847544e57a7`
- Metadata-clean source input: `assets/photo-sources/dummy-13-spider-man.jpg`
- Input SHA-256: `bfe5057f493dbe26f8487c77521eb2692b74aa96685718534c14e87568ee4bc5`
- Handoff: QA branch claude/photo-handoff commit fe19da8 (HNYCMB517-dummy13-spider-man.jpg), SHA-256 verified before import; Drive original in the owner's HoneyComb folder; owner said "list those" on 2026-10-16. Metadata removed with scripts/clean-source.py; decoded pixels verified identical to the original.
- Source dimensions: 1920 × 1920; EXIF orientation 1.
- Applied crop box after orientation: `(219, 200, 1619, 1600)`.
- Square storefront frame (inside the applied crop): `(219, 200, 1619, 1600)`. The whole crouching figure.
- Link-preview image: the square storefront frame at 1200 × 1200, baseline JPEG without metadata.

| Output | Resize width | Actual dimensions | Bytes | Quality | Output SHA-256 |
|---|---:|---|---:|---:|---|
| `/assets/dummy-13-spider-man-480.webp` | 480 | 480 × 480 | 15208 | 82 | `866a2f968436f2004148086ea3a5890f40ad1d2a812a2d1cbcb079e21de1c787` |
| `/assets/dummy-13-spider-man-480.avif` | 480 | 480 × 480 | 10521 | AVIF 60 | `8e235e73779df3498c0a6ecf732ca3d015e0829b3668e4121478ca471d1600dd` |
| `/assets/dummy-13-spider-man-960.webp` | 960 | 960 × 960 | 37456 | 82 | `6fb9304e63f1cff159ce1ac522d261607060da6432ad80d028f59bc7c6df8857` |
| `/assets/dummy-13-spider-man-960.avif` | 960 | 960 × 960 | 23272 | AVIF 60 | `92cf8ebcabb520caec248bc5ae68ee6af52e03ff16c3e42cc49bbc05566146e0` |
| `/assets/dummy-13-spider-man-sq-160.webp` | 160 | 160 × 160 | 3888 | 82 | `9651c554031446c2c5408a617c9af4bdca6ed2b8fe1bf31c756749bcb9b3cf2e` |
| `/assets/dummy-13-spider-man-sq-160.avif` | 160 | 160 × 160 | 3259 | AVIF 60 | `92a7eb8c18f3c12cffa55b498eeab4d723591420365ae06397209d19b283edd4` |
| `/assets/dummy-13-spider-man-sq-320.webp` | 320 | 320 × 320 | 9314 | 82 | `5fde2de48a056bccd10db88998260ddb09b9e60144a8f344939403b9d556b630` |
| `/assets/dummy-13-spider-man-sq-320.avif` | 320 | 320 × 320 | 6812 | AVIF 60 | `ec908a818ebb18487f19ddf968440f22c514dd2eba165220b91ff5ca8d211c88` |
| `/assets/dummy-13-spider-man-sq-480.webp` | 480 | 480 × 480 | 15208 | 82 | `866a2f968436f2004148086ea3a5890f40ad1d2a812a2d1cbcb079e21de1c787` |
| `/assets/dummy-13-spider-man-sq-480.avif` | 480 | 480 × 480 | 10521 | AVIF 60 | `8e235e73779df3498c0a6ecf732ca3d015e0829b3668e4121478ca471d1600dd` |
| `/assets/dummy-13-spider-man-sq-640.webp` | 640 | 640 × 640 | 21724 | 82 | `68e4e6864f19f5f2a6d1fc91b72215250c926b1f109afa4eb9bfbe196744b715` |
| `/assets/dummy-13-spider-man-sq-640.avif` | 640 | 640 × 640 | 14654 | AVIF 60 | `f45ed7ec079c6396478da23c7c86b53c5ab7a9943731bfd2de35c8278d236cee` |
| `/assets/dummy-13-spider-man-sq-960.webp` | 960 | 960 × 960 | 37456 | 82 | `6fb9304e63f1cff159ce1ac522d261607060da6432ad80d028f59bc7c6df8857` |
| `/assets/dummy-13-spider-man-sq-960.avif` | 960 | 960 × 960 | 23272 | AVIF 60 | `92cf8ebcabb520caec248bc5ae68ee6af52e03ff16c3e42cc49bbc05566146e0` |
| `/assets/dummy-13-spider-man-sq-1200.webp` | 1200 | 1200 × 1200 | 49952 | 82 | `7a548920ffa55617d443542b60f297463af62645d07e06fd5c64cad9cccc615c` |
| `/assets/dummy-13-spider-man-sq-1200.avif` | 1200 | 1200 × 1200 | 30009 | AVIF 60 | `5aeddf32cc8bd6d24e2c72e21ed243eef62677bec6239171ef43cfb876af4392` |
| `/assets/dummy-13-spider-man-share.jpg` | 1200 | 1200 × 1200 | 107345 | JPEG 84 | `c6721cbd8c3a45b23b0c6cfc022525b7ce9be4a1210907513290594898d9305b` |

## HNYCMB518

- Source title: `HNYCMB518-horse-figurine.jpg`
- Source Drive ID: `1R7Pk1CEex_vlpISjuao7VyQZI_C8vDOU`
- Drive original SHA-256: `0ca883d8de5de9fa5412fc861bc219cc70772766b11c008aa8a4098076ba54ca`
- Metadata-clean source input: `assets/photo-sources/horse-figurine.jpg`
- Input SHA-256: `d3302a60cd6e3a4a3758d5d31b6bf2106609ef1d0c80e81fdfc912f6567563b4`
- Handoff: QA branch claude/photo-handoff commit fe19da8 (HNYCMB518-horse-figurine.jpg), SHA-256 verified before import; Drive original in the owner's HoneyComb folder; owner said "list those" on 2026-10-16. Metadata removed with scripts/clean-source.py; decoded pixels verified identical to the original.
- Source dimensions: 1920 × 2560; EXIF orientation 1.
- Applied crop box after orientation: `(144, 730, 1794, 2380)`.
- Square storefront frame (inside the applied crop): `(144, 730, 1794, 2380)`. The whole horse and base.
- Link-preview image: the square storefront frame at 1200 × 1200, baseline JPEG without metadata.

| Output | Resize width | Actual dimensions | Bytes | Quality | Output SHA-256 |
|---|---:|---|---:|---:|---|
| `/assets/horse-figurine-480.webp` | 480 | 480 × 480 | 18722 | 82 | `f53f00b71775847d09cf63788f4d8ab0eb7b75a39b522e04e4a533c629a7ec8d` |
| `/assets/horse-figurine-480.avif` | 480 | 480 × 480 | 12849 | AVIF 60 | `bc8ffc5f209cde99032c53fa44cdda54e731ce8fd1caa1f48cb89a71438a1ff8` |
| `/assets/horse-figurine-960.webp` | 960 | 960 × 960 | 42240 | 82 | `c0353471f246a1c525cfe326b956bdfda8968fb0ba2a3ea4792c2e531d3bcb71` |
| `/assets/horse-figurine-960.avif` | 960 | 960 × 960 | 26202 | AVIF 60 | `c42b75f83b9420f8c57ec51eb99336bd21e0b2fbbdc890dbdc5fa05ee5b4f666` |
| `/assets/horse-figurine-sq-160.webp` | 160 | 160 × 160 | 4160 | 82 | `099d5cb195dce3dc22aa7320cf310050c98e018f486e88bdbb92e2dbd18702ea` |
| `/assets/horse-figurine-sq-160.avif` | 160 | 160 × 160 | 3747 | AVIF 60 | `cdf2dee3423825a292815083bc47787b8d2df945f77d9186e9550cd3be919aff` |
| `/assets/horse-figurine-sq-320.webp` | 320 | 320 × 320 | 10848 | 82 | `66446902b731388151ae1482f0dd183c48344afbde2441d6aeb77d2778c1b8ea` |
| `/assets/horse-figurine-sq-320.avif` | 320 | 320 × 320 | 8464 | AVIF 60 | `08e695180cd5fb10e13fab15aef2295cc66bb3a1b834317be0c25f5ed69c512b` |
| `/assets/horse-figurine-sq-480.webp` | 480 | 480 × 480 | 18722 | 82 | `f53f00b71775847d09cf63788f4d8ab0eb7b75a39b522e04e4a533c629a7ec8d` |
| `/assets/horse-figurine-sq-480.avif` | 480 | 480 × 480 | 12849 | AVIF 60 | `bc8ffc5f209cde99032c53fa44cdda54e731ce8fd1caa1f48cb89a71438a1ff8` |
| `/assets/horse-figurine-sq-640.webp` | 640 | 640 × 640 | 25650 | 82 | `89bcce6fb4bead364861bdeb2f12cec2682ef00ac38aa0e80bf9ef66019ccfdc` |
| `/assets/horse-figurine-sq-640.avif` | 640 | 640 × 640 | 17655 | AVIF 60 | `29c338682fa82782a7e25f87e386048ebcf46cf9a76b9005fddd75e7988c7b0e` |
| `/assets/horse-figurine-sq-960.webp` | 960 | 960 × 960 | 42240 | 82 | `c0353471f246a1c525cfe326b956bdfda8968fb0ba2a3ea4792c2e531d3bcb71` |
| `/assets/horse-figurine-sq-960.avif` | 960 | 960 × 960 | 26202 | AVIF 60 | `c42b75f83b9420f8c57ec51eb99336bd21e0b2fbbdc890dbdc5fa05ee5b4f666` |
| `/assets/horse-figurine-sq-1200.webp` | 1200 | 1200 × 1200 | 55280 | 82 | `6589c86362e913b566029f9523693fed351bd53c277315338f2259fe2ec8f820` |
| `/assets/horse-figurine-sq-1200.avif` | 1200 | 1200 × 1200 | 32762 | AVIF 60 | `2c533533a3c831cc73d224eb1ce09a183af1e3e112b745d387acecb605fc99d8` |
| `/assets/horse-figurine-share.jpg` | 1200 | 1200 × 1200 | 130548 | JPEG 84 | `e73b979a984b8ef3f40bbf9485a39eeef09098a7365399ca73e2bc26c1136f4b` |

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
