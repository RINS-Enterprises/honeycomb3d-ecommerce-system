# Image audit

- Reviewed commit: `8d13b910bc4ff156a2ffd049cd4cc381f19828ad`
- Counts: {"FAIL":188,"INFO":96}

## Assets

| Asset | Natural | Decodes | Largest rendered side (CSS px) | Alt text(s) |
|---|---|---|---|---|
| /assets/honeycomb-logo-web.png | 7435x2229 | yes | 220 | HoneyComb |
| /assets/kurama.jpg | 1024x1024 | yes | 570 | Orange Kurama figure with nine raised tails against a dark background |
| /assets/hidden-leaf.jpg | 960x1280 | yes | 570 | Black-and-white Hidden Leaf keychain with a metal ring on a green display surface |
| /assets/baymax.png | 1536x2048 | yes | 570 | White 3D-printed Baymax figures photographed on a green display surface |
| /assets/night-fury.jpg | 3000x4000 | yes | 570 | Black articulated Night Fury keychains with yellow eyes on a blue surface |
| /assets/minato-kunai.jpg | 1024x1024 | yes | 570 | Black three-pronged Minato kunai prop with a white handle held in a hand |
| /assets/light-fury.jpg | 1024x1024 | yes | 570 | White articulated Light Fury keychain with blue eyes and a metal keyring |
| /assets/classic-kunai.jpg | 1024x1024 | yes | 570 | Black classic kunai prop with a white handle against a dark background |

## Image bytes per page

- home@mobile: 7.27 MB
- shop@mobile: 7.87 MB
- products-hidden-leaf-keychain@mobile: 6.75 MB
- products-baymax-figure@mobile: 6.75 MB
- products-kurama-figure@mobile: 6.75 MB
- products-night-fury-keychain@mobile: 6.75 MB
- products-minato-kunai@mobile: 4.81 MB
- products-light-fury-keychain@mobile: 4.68 MB
- products-classic-kunai@mobile: 4.65 MB
- home@desktop: 7.27 MB
- shop@desktop: 7.87 MB
- products-hidden-leaf-keychain@desktop: 6.75 MB
- products-baymax-figure@desktop: 6.75 MB
- products-kurama-figure@desktop: 6.75 MB
- products-night-fury-keychain@desktop: 6.75 MB
- products-minato-kunai@desktop: 4.81 MB
- products-light-fury-keychain@desktop: 4.68 MB
- products-classic-kunai@desktop: 4.65 MB

## All checks

| Status | Check | Detail |
|---|---|---|
| FAIL | home@mobile /assets/honeycomb-logo-web.png | oversized: 7435x2229 natural for 200x60 CSS px at DPR 3 (12.4x needed resolution) |
| FAIL | home@mobile /assets/honeycomb-logo-web.png | decodes to 16.6 MP (~66 MB RGBA) |
| FAIL | home@mobile /assets/kurama.jpg | 0.52 MB transferred (limit 0.5 MB) |
| INFO | home@mobile /assets/hidden-leaf.jpg | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | home@mobile /assets/hidden-leaf.jpg | width/height attrs 640x640 disagree with intrinsic ratio 0.75 |
| FAIL | home@mobile /assets/baymax.png | oversized: 1536x2048 natural for 167x167 CSS px at DPR 3 (4.1x needed resolution) |
| FAIL | home@mobile /assets/baymax.png | 3.23 MB transferred (limit 0.5 MB) |
| INFO | home@mobile /assets/baymax.png | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | home@mobile /assets/baymax.png | width/height attrs 640x640 disagree with intrinsic ratio 0.75 |
| FAIL | home@mobile /assets/kurama.jpg | 0.52 MB transferred (limit 0.5 MB) |
| FAIL | home@mobile /assets/night-fury.jpg | oversized: 3000x4000 natural for 167x167 CSS px at DPR 3 (8.0x needed resolution) |
| FAIL | home@mobile /assets/night-fury.jpg | 2.41 MB transferred (limit 0.5 MB) |
| INFO | home@mobile /assets/night-fury.jpg | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | home@mobile /assets/night-fury.jpg | width/height attrs 640x640 disagree with intrinsic ratio 0.75 |
| FAIL | home@mobile /assets/honeycomb-logo-web.png | oversized: 7435x2229 natural for 200x60 CSS px at DPR 3 (12.4x needed resolution) |
| FAIL | home@mobile /assets/honeycomb-logo-web.png | decodes to 16.6 MP (~66 MB RGBA) |
| FAIL | home@mobile page-image-bytes | 7.27 MB of images on / (limit 1.5 MB); LCP 160 ms (text) on local server |
| FAIL | shop@mobile /assets/honeycomb-logo-web.png | oversized: 7435x2229 natural for 200x60 CSS px at DPR 3 (12.4x needed resolution) |
| FAIL | shop@mobile /assets/honeycomb-logo-web.png | decodes to 16.6 MP (~66 MB RGBA) |
| INFO | shop@mobile /assets/hidden-leaf.jpg | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | shop@mobile /assets/hidden-leaf.jpg | width/height attrs 640x640 disagree with intrinsic ratio 0.75 |
| FAIL | shop@mobile /assets/baymax.png | oversized: 1536x2048 natural for 167x167 CSS px at DPR 3 (4.1x needed resolution) |
| FAIL | shop@mobile /assets/baymax.png | 3.23 MB transferred (limit 0.5 MB) |
| INFO | shop@mobile /assets/baymax.png | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | shop@mobile /assets/baymax.png | width/height attrs 640x640 disagree with intrinsic ratio 0.75 |
| FAIL | shop@mobile /assets/kurama.jpg | 0.52 MB transferred (limit 0.5 MB) |
| FAIL | shop@mobile /assets/night-fury.jpg | oversized: 3000x4000 natural for 167x167 CSS px at DPR 3 (8.0x needed resolution) |
| FAIL | shop@mobile /assets/night-fury.jpg | 2.41 MB transferred (limit 0.5 MB) |
| INFO | shop@mobile /assets/night-fury.jpg | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | shop@mobile /assets/night-fury.jpg | width/height attrs 640x640 disagree with intrinsic ratio 0.75 |
| FAIL | shop@mobile /assets/honeycomb-logo-web.png | oversized: 7435x2229 natural for 200x60 CSS px at DPR 3 (12.4x needed resolution) |
| FAIL | shop@mobile /assets/honeycomb-logo-web.png | decodes to 16.6 MP (~66 MB RGBA) |
| FAIL | shop@mobile page-image-bytes | 7.87 MB of images on /shop/ (limit 1.5 MB); LCP 144 ms (text) on local server |
| FAIL | products-hidden-leaf-keychain@mobile /assets/honeycomb-logo-web.png | oversized: 7435x2229 natural for 200x60 CSS px at DPR 3 (12.4x needed resolution) |
| FAIL | products-hidden-leaf-keychain@mobile /assets/honeycomb-logo-web.png | decodes to 16.6 MP (~66 MB RGBA) |
| INFO | products-hidden-leaf-keychain@mobile /assets/hidden-leaf.jpg | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | products-hidden-leaf-keychain@mobile /assets/hidden-leaf.jpg | width/height attrs 640x640 disagree with intrinsic ratio 0.75 |
| FAIL | products-hidden-leaf-keychain@mobile /assets/baymax.png | oversized: 1536x2048 natural for 167x167 CSS px at DPR 3 (4.1x needed resolution) |
| FAIL | products-hidden-leaf-keychain@mobile /assets/baymax.png | 3.23 MB transferred (limit 0.5 MB) |
| INFO | products-hidden-leaf-keychain@mobile /assets/baymax.png | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | products-hidden-leaf-keychain@mobile /assets/baymax.png | width/height attrs 640x640 disagree with intrinsic ratio 0.75 |
| FAIL | products-hidden-leaf-keychain@mobile /assets/kurama.jpg | 0.52 MB transferred (limit 0.5 MB) |
| FAIL | products-hidden-leaf-keychain@mobile /assets/night-fury.jpg | oversized: 3000x4000 natural for 167x167 CSS px at DPR 3 (8.0x needed resolution) |
| FAIL | products-hidden-leaf-keychain@mobile /assets/night-fury.jpg | 2.41 MB transferred (limit 0.5 MB) |
| INFO | products-hidden-leaf-keychain@mobile /assets/night-fury.jpg | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | products-hidden-leaf-keychain@mobile /assets/night-fury.jpg | width/height attrs 640x640 disagree with intrinsic ratio 0.75 |
| FAIL | products-hidden-leaf-keychain@mobile /assets/honeycomb-logo-web.png | oversized: 7435x2229 natural for 200x60 CSS px at DPR 3 (12.4x needed resolution) |
| FAIL | products-hidden-leaf-keychain@mobile /assets/honeycomb-logo-web.png | decodes to 16.6 MP (~66 MB RGBA) |
| FAIL | products-hidden-leaf-keychain@mobile page-image-bytes | 6.75 MB of images on /products/hidden-leaf-keychain/ (limit 1.5 MB); LCP 128 ms (/assets/hidden-leaf.jpg) on local server |
| FAIL | products-baymax-figure@mobile /assets/honeycomb-logo-web.png | oversized: 7435x2229 natural for 200x60 CSS px at DPR 3 (12.4x needed resolution) |
| FAIL | products-baymax-figure@mobile /assets/honeycomb-logo-web.png | decodes to 16.6 MP (~66 MB RGBA) |
| FAIL | products-baymax-figure@mobile /assets/baymax.png | 3.23 MB transferred (limit 0.5 MB) |
| INFO | products-baymax-figure@mobile /assets/baymax.png | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | products-baymax-figure@mobile /assets/baymax.png | width/height attrs 640x640 disagree with intrinsic ratio 0.75 |
| INFO | products-baymax-figure@mobile /assets/hidden-leaf.jpg | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | products-baymax-figure@mobile /assets/hidden-leaf.jpg | width/height attrs 640x640 disagree with intrinsic ratio 0.75 |
| FAIL | products-baymax-figure@mobile /assets/kurama.jpg | 0.52 MB transferred (limit 0.5 MB) |
| FAIL | products-baymax-figure@mobile /assets/night-fury.jpg | oversized: 3000x4000 natural for 167x167 CSS px at DPR 3 (8.0x needed resolution) |
| FAIL | products-baymax-figure@mobile /assets/night-fury.jpg | 2.41 MB transferred (limit 0.5 MB) |
| INFO | products-baymax-figure@mobile /assets/night-fury.jpg | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | products-baymax-figure@mobile /assets/night-fury.jpg | width/height attrs 640x640 disagree with intrinsic ratio 0.75 |
| FAIL | products-baymax-figure@mobile /assets/honeycomb-logo-web.png | oversized: 7435x2229 natural for 200x60 CSS px at DPR 3 (12.4x needed resolution) |
| FAIL | products-baymax-figure@mobile /assets/honeycomb-logo-web.png | decodes to 16.6 MP (~66 MB RGBA) |
| FAIL | products-baymax-figure@mobile page-image-bytes | 6.75 MB of images on /products/baymax-figure/ (limit 1.5 MB); LCP 204 ms (/assets/baymax.jpg) on local server |
| FAIL | products-kurama-figure@mobile /assets/honeycomb-logo-web.png | oversized: 7435x2229 natural for 200x60 CSS px at DPR 3 (12.4x needed resolution) |
| FAIL | products-kurama-figure@mobile /assets/honeycomb-logo-web.png | decodes to 16.6 MP (~66 MB RGBA) |
| FAIL | products-kurama-figure@mobile /assets/kurama.jpg | 0.52 MB transferred (limit 0.5 MB) |
| INFO | products-kurama-figure@mobile /assets/hidden-leaf.jpg | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | products-kurama-figure@mobile /assets/hidden-leaf.jpg | width/height attrs 640x640 disagree with intrinsic ratio 0.75 |
| FAIL | products-kurama-figure@mobile /assets/baymax.png | oversized: 1536x2048 natural for 167x167 CSS px at DPR 3 (4.1x needed resolution) |
| FAIL | products-kurama-figure@mobile /assets/baymax.png | 3.23 MB transferred (limit 0.5 MB) |
| INFO | products-kurama-figure@mobile /assets/baymax.png | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | products-kurama-figure@mobile /assets/baymax.png | width/height attrs 640x640 disagree with intrinsic ratio 0.75 |
| FAIL | products-kurama-figure@mobile /assets/night-fury.jpg | oversized: 3000x4000 natural for 167x167 CSS px at DPR 3 (8.0x needed resolution) |
| FAIL | products-kurama-figure@mobile /assets/night-fury.jpg | 2.41 MB transferred (limit 0.5 MB) |
| INFO | products-kurama-figure@mobile /assets/night-fury.jpg | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | products-kurama-figure@mobile /assets/night-fury.jpg | width/height attrs 640x640 disagree with intrinsic ratio 0.75 |
| FAIL | products-kurama-figure@mobile /assets/honeycomb-logo-web.png | oversized: 7435x2229 natural for 200x60 CSS px at DPR 3 (12.4x needed resolution) |
| FAIL | products-kurama-figure@mobile /assets/honeycomb-logo-web.png | decodes to 16.6 MP (~66 MB RGBA) |
| FAIL | products-kurama-figure@mobile page-image-bytes | 6.75 MB of images on /products/kurama-figure/ (limit 1.5 MB); LCP 120 ms (/assets/kurama.jpg) on local server |
| FAIL | products-night-fury-keychain@mobile /assets/honeycomb-logo-web.png | oversized: 7435x2229 natural for 200x60 CSS px at DPR 3 (12.4x needed resolution) |
| FAIL | products-night-fury-keychain@mobile /assets/honeycomb-logo-web.png | decodes to 16.6 MP (~66 MB RGBA) |
| FAIL | products-night-fury-keychain@mobile /assets/night-fury.jpg | oversized: 3000x4000 natural for 350x350 CSS px at DPR 3 (3.8x needed resolution) |
| FAIL | products-night-fury-keychain@mobile /assets/night-fury.jpg | 2.41 MB transferred (limit 0.5 MB) |
| INFO | products-night-fury-keychain@mobile /assets/night-fury.jpg | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | products-night-fury-keychain@mobile /assets/night-fury.jpg | width/height attrs 640x640 disagree with intrinsic ratio 0.75 |
| INFO | products-night-fury-keychain@mobile /assets/hidden-leaf.jpg | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | products-night-fury-keychain@mobile /assets/hidden-leaf.jpg | width/height attrs 640x640 disagree with intrinsic ratio 0.75 |
| FAIL | products-night-fury-keychain@mobile /assets/baymax.png | oversized: 1536x2048 natural for 167x167 CSS px at DPR 3 (4.1x needed resolution) |
| FAIL | products-night-fury-keychain@mobile /assets/baymax.png | 3.23 MB transferred (limit 0.5 MB) |
| INFO | products-night-fury-keychain@mobile /assets/baymax.png | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | products-night-fury-keychain@mobile /assets/baymax.png | width/height attrs 640x640 disagree with intrinsic ratio 0.75 |
| FAIL | products-night-fury-keychain@mobile /assets/kurama.jpg | 0.52 MB transferred (limit 0.5 MB) |
| FAIL | products-night-fury-keychain@mobile /assets/honeycomb-logo-web.png | oversized: 7435x2229 natural for 200x60 CSS px at DPR 3 (12.4x needed resolution) |
| FAIL | products-night-fury-keychain@mobile /assets/honeycomb-logo-web.png | decodes to 16.6 MP (~66 MB RGBA) |
| FAIL | products-night-fury-keychain@mobile page-image-bytes | 6.75 MB of images on /products/night-fury-keychain/ (limit 1.5 MB); LCP 592 ms (/assets/night-fury.jpg) on local server |
| FAIL | products-minato-kunai@mobile /assets/honeycomb-logo-web.png | oversized: 7435x2229 natural for 200x60 CSS px at DPR 3 (12.4x needed resolution) |
| FAIL | products-minato-kunai@mobile /assets/honeycomb-logo-web.png | decodes to 16.6 MP (~66 MB RGBA) |
| INFO | products-minato-kunai@mobile /assets/hidden-leaf.jpg | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | products-minato-kunai@mobile /assets/hidden-leaf.jpg | width/height attrs 640x640 disagree with intrinsic ratio 0.75 |
| FAIL | products-minato-kunai@mobile /assets/baymax.png | oversized: 1536x2048 natural for 167x167 CSS px at DPR 3 (4.1x needed resolution) |
| FAIL | products-minato-kunai@mobile /assets/baymax.png | 3.23 MB transferred (limit 0.5 MB) |
| INFO | products-minato-kunai@mobile /assets/baymax.png | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | products-minato-kunai@mobile /assets/baymax.png | width/height attrs 640x640 disagree with intrinsic ratio 0.75 |
| FAIL | products-minato-kunai@mobile /assets/kurama.jpg | 0.52 MB transferred (limit 0.5 MB) |
| FAIL | products-minato-kunai@mobile /assets/honeycomb-logo-web.png | oversized: 7435x2229 natural for 200x60 CSS px at DPR 3 (12.4x needed resolution) |
| FAIL | products-minato-kunai@mobile /assets/honeycomb-logo-web.png | decodes to 16.6 MP (~66 MB RGBA) |
| FAIL | products-minato-kunai@mobile page-image-bytes | 4.81 MB of images on /products/minato-kunai/ (limit 1.5 MB); LCP 116 ms (/assets/minato-kunai.jpg) on local server |
| FAIL | products-light-fury-keychain@mobile /assets/honeycomb-logo-web.png | oversized: 7435x2229 natural for 200x60 CSS px at DPR 3 (12.4x needed resolution) |
| FAIL | products-light-fury-keychain@mobile /assets/honeycomb-logo-web.png | decodes to 16.6 MP (~66 MB RGBA) |
| INFO | products-light-fury-keychain@mobile /assets/hidden-leaf.jpg | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | products-light-fury-keychain@mobile /assets/hidden-leaf.jpg | width/height attrs 640x640 disagree with intrinsic ratio 0.75 |
| FAIL | products-light-fury-keychain@mobile /assets/baymax.png | oversized: 1536x2048 natural for 167x167 CSS px at DPR 3 (4.1x needed resolution) |
| FAIL | products-light-fury-keychain@mobile /assets/baymax.png | 3.23 MB transferred (limit 0.5 MB) |
| INFO | products-light-fury-keychain@mobile /assets/baymax.png | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | products-light-fury-keychain@mobile /assets/baymax.png | width/height attrs 640x640 disagree with intrinsic ratio 0.75 |
| FAIL | products-light-fury-keychain@mobile /assets/kurama.jpg | 0.52 MB transferred (limit 0.5 MB) |
| FAIL | products-light-fury-keychain@mobile /assets/honeycomb-logo-web.png | oversized: 7435x2229 natural for 200x60 CSS px at DPR 3 (12.4x needed resolution) |
| FAIL | products-light-fury-keychain@mobile /assets/honeycomb-logo-web.png | decodes to 16.6 MP (~66 MB RGBA) |
| FAIL | products-light-fury-keychain@mobile page-image-bytes | 4.68 MB of images on /products/light-fury-keychain/ (limit 1.5 MB); LCP 108 ms (/assets/light-fury.jpg) on local server |
| FAIL | products-classic-kunai@mobile /assets/honeycomb-logo-web.png | oversized: 7435x2229 natural for 200x60 CSS px at DPR 3 (12.4x needed resolution) |
| FAIL | products-classic-kunai@mobile /assets/honeycomb-logo-web.png | decodes to 16.6 MP (~66 MB RGBA) |
| INFO | products-classic-kunai@mobile /assets/hidden-leaf.jpg | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | products-classic-kunai@mobile /assets/hidden-leaf.jpg | width/height attrs 640x640 disagree with intrinsic ratio 0.75 |
| FAIL | products-classic-kunai@mobile /assets/baymax.png | oversized: 1536x2048 natural for 167x167 CSS px at DPR 3 (4.1x needed resolution) |
| FAIL | products-classic-kunai@mobile /assets/baymax.png | 3.23 MB transferred (limit 0.5 MB) |
| INFO | products-classic-kunai@mobile /assets/baymax.png | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | products-classic-kunai@mobile /assets/baymax.png | width/height attrs 640x640 disagree with intrinsic ratio 0.75 |
| FAIL | products-classic-kunai@mobile /assets/kurama.jpg | 0.52 MB transferred (limit 0.5 MB) |
| FAIL | products-classic-kunai@mobile /assets/honeycomb-logo-web.png | oversized: 7435x2229 natural for 200x60 CSS px at DPR 3 (12.4x needed resolution) |
| FAIL | products-classic-kunai@mobile /assets/honeycomb-logo-web.png | decodes to 16.6 MP (~66 MB RGBA) |
| FAIL | products-classic-kunai@mobile page-image-bytes | 4.65 MB of images on /products/classic-kunai/ (limit 1.5 MB); LCP 112 ms (/assets/classic-kunai.jpg) on local server |
| FAIL | home@desktop /assets/honeycomb-logo-web.png | oversized: 7435x2229 natural for 220x66 CSS px at DPR 1 (33.8x needed resolution) |
| FAIL | home@desktop /assets/honeycomb-logo-web.png | decodes to 16.6 MP (~66 MB RGBA) |
| FAIL | home@desktop /assets/kurama.jpg | 0.52 MB transferred (limit 0.5 MB) |
| FAIL | home@desktop /assets/hidden-leaf.jpg | oversized: 960x1280 natural for 282x282 CSS px at DPR 1 (4.5x needed resolution) |
| INFO | home@desktop /assets/hidden-leaf.jpg | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | home@desktop /assets/hidden-leaf.jpg | width/height attrs 640x640 disagree with intrinsic ratio 0.75 |
| FAIL | home@desktop /assets/baymax.png | oversized: 1536x2048 natural for 282x282 CSS px at DPR 1 (7.3x needed resolution) |
| FAIL | home@desktop /assets/baymax.png | 3.23 MB transferred (limit 0.5 MB) |
| INFO | home@desktop /assets/baymax.png | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | home@desktop /assets/baymax.png | width/height attrs 640x640 disagree with intrinsic ratio 0.75 |
| FAIL | home@desktop /assets/kurama.jpg | oversized: 1024x1024 natural for 282x282 CSS px at DPR 1 (3.6x needed resolution) |
| FAIL | home@desktop /assets/kurama.jpg | 0.52 MB transferred (limit 0.5 MB) |
| FAIL | home@desktop /assets/night-fury.jpg | oversized: 3000x4000 natural for 282x282 CSS px at DPR 1 (14.2x needed resolution) |
| FAIL | home@desktop /assets/night-fury.jpg | 2.41 MB transferred (limit 0.5 MB) |
| INFO | home@desktop /assets/night-fury.jpg | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | home@desktop /assets/night-fury.jpg | width/height attrs 640x640 disagree with intrinsic ratio 0.75 |
| FAIL | home@desktop /assets/honeycomb-logo-web.png | oversized: 7435x2229 natural for 220x66 CSS px at DPR 1 (33.8x needed resolution) |
| FAIL | home@desktop /assets/honeycomb-logo-web.png | decodes to 16.6 MP (~66 MB RGBA) |
| FAIL | home@desktop page-image-bytes | 7.27 MB of images on / (limit 1.5 MB); LCP 128 ms (/assets/kurama.jpg) on local server |
| FAIL | shop@desktop /assets/honeycomb-logo-web.png | oversized: 7435x2229 natural for 220x66 CSS px at DPR 1 (33.8x needed resolution) |
| FAIL | shop@desktop /assets/honeycomb-logo-web.png | decodes to 16.6 MP (~66 MB RGBA) |
| FAIL | shop@desktop /assets/hidden-leaf.jpg | oversized: 960x1280 natural for 282x282 CSS px at DPR 1 (4.5x needed resolution) |
| INFO | shop@desktop /assets/hidden-leaf.jpg | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | shop@desktop /assets/hidden-leaf.jpg | width/height attrs 640x640 disagree with intrinsic ratio 0.75 |
| FAIL | shop@desktop /assets/baymax.png | oversized: 1536x2048 natural for 282x282 CSS px at DPR 1 (7.3x needed resolution) |
| FAIL | shop@desktop /assets/baymax.png | 3.23 MB transferred (limit 0.5 MB) |
| INFO | shop@desktop /assets/baymax.png | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | shop@desktop /assets/baymax.png | width/height attrs 640x640 disagree with intrinsic ratio 0.75 |
| FAIL | shop@desktop /assets/kurama.jpg | oversized: 1024x1024 natural for 282x282 CSS px at DPR 1 (3.6x needed resolution) |
| FAIL | shop@desktop /assets/kurama.jpg | 0.52 MB transferred (limit 0.5 MB) |
| FAIL | shop@desktop /assets/night-fury.jpg | oversized: 3000x4000 natural for 282x282 CSS px at DPR 1 (14.2x needed resolution) |
| FAIL | shop@desktop /assets/night-fury.jpg | 2.41 MB transferred (limit 0.5 MB) |
| INFO | shop@desktop /assets/night-fury.jpg | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | shop@desktop /assets/night-fury.jpg | width/height attrs 640x640 disagree with intrinsic ratio 0.75 |
| FAIL | shop@desktop /assets/minato-kunai.jpg | oversized: 1024x1024 natural for 282x282 CSS px at DPR 1 (3.6x needed resolution) |
| FAIL | shop@desktop /assets/light-fury.jpg | oversized: 1024x1024 natural for 282x282 CSS px at DPR 1 (3.6x needed resolution) |
| FAIL | shop@desktop /assets/classic-kunai.jpg | oversized: 1024x1024 natural for 282x282 CSS px at DPR 1 (3.6x needed resolution) |
| FAIL | shop@desktop /assets/honeycomb-logo-web.png | oversized: 7435x2229 natural for 220x66 CSS px at DPR 1 (33.8x needed resolution) |
| FAIL | shop@desktop /assets/honeycomb-logo-web.png | decodes to 16.6 MP (~66 MB RGBA) |
| FAIL | shop@desktop page-image-bytes | 7.87 MB of images on /shop/ (limit 1.5 MB); LCP 328 ms (/assets/kurama.jpg) on local server |
| FAIL | products-hidden-leaf-keychain@desktop /assets/honeycomb-logo-web.png | oversized: 7435x2229 natural for 220x66 CSS px at DPR 1 (33.8x needed resolution) |
| FAIL | products-hidden-leaf-keychain@desktop /assets/honeycomb-logo-web.png | decodes to 16.6 MP (~66 MB RGBA) |
| INFO | products-hidden-leaf-keychain@desktop /assets/hidden-leaf.jpg | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | products-hidden-leaf-keychain@desktop /assets/hidden-leaf.jpg | width/height attrs 640x640 disagree with intrinsic ratio 0.75 |
| FAIL | products-hidden-leaf-keychain@desktop /assets/baymax.png | oversized: 1536x2048 natural for 282x282 CSS px at DPR 1 (7.3x needed resolution) |
| FAIL | products-hidden-leaf-keychain@desktop /assets/baymax.png | 3.23 MB transferred (limit 0.5 MB) |
| INFO | products-hidden-leaf-keychain@desktop /assets/baymax.png | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | products-hidden-leaf-keychain@desktop /assets/baymax.png | width/height attrs 640x640 disagree with intrinsic ratio 0.75 |
| FAIL | products-hidden-leaf-keychain@desktop /assets/kurama.jpg | oversized: 1024x1024 natural for 282x282 CSS px at DPR 1 (3.6x needed resolution) |
| FAIL | products-hidden-leaf-keychain@desktop /assets/kurama.jpg | 0.52 MB transferred (limit 0.5 MB) |
| FAIL | products-hidden-leaf-keychain@desktop /assets/night-fury.jpg | oversized: 3000x4000 natural for 282x282 CSS px at DPR 1 (14.2x needed resolution) |
| FAIL | products-hidden-leaf-keychain@desktop /assets/night-fury.jpg | 2.41 MB transferred (limit 0.5 MB) |
| INFO | products-hidden-leaf-keychain@desktop /assets/night-fury.jpg | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | products-hidden-leaf-keychain@desktop /assets/night-fury.jpg | width/height attrs 640x640 disagree with intrinsic ratio 0.75 |
| FAIL | products-hidden-leaf-keychain@desktop /assets/honeycomb-logo-web.png | oversized: 7435x2229 natural for 220x66 CSS px at DPR 1 (33.8x needed resolution) |
| FAIL | products-hidden-leaf-keychain@desktop /assets/honeycomb-logo-web.png | decodes to 16.6 MP (~66 MB RGBA) |
| FAIL | products-hidden-leaf-keychain@desktop page-image-bytes | 6.75 MB of images on /products/hidden-leaf-keychain/ (limit 1.5 MB); LCP 128 ms (/assets/hidden-leaf.jpg) on local server |
| FAIL | products-baymax-figure@desktop /assets/honeycomb-logo-web.png | oversized: 7435x2229 natural for 220x66 CSS px at DPR 1 (33.8x needed resolution) |
| FAIL | products-baymax-figure@desktop /assets/honeycomb-logo-web.png | decodes to 16.6 MP (~66 MB RGBA) |
| FAIL | products-baymax-figure@desktop /assets/baymax.png | oversized: 1536x2048 natural for 570x570 CSS px at DPR 1 (3.6x needed resolution) |
| FAIL | products-baymax-figure@desktop /assets/baymax.png | 3.23 MB transferred (limit 0.5 MB) |
| INFO | products-baymax-figure@desktop /assets/baymax.png | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | products-baymax-figure@desktop /assets/baymax.png | width/height attrs 640x640 disagree with intrinsic ratio 0.75 |
| FAIL | products-baymax-figure@desktop /assets/hidden-leaf.jpg | oversized: 960x1280 natural for 282x282 CSS px at DPR 1 (4.5x needed resolution) |
| INFO | products-baymax-figure@desktop /assets/hidden-leaf.jpg | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | products-baymax-figure@desktop /assets/hidden-leaf.jpg | width/height attrs 640x640 disagree with intrinsic ratio 0.75 |
| FAIL | products-baymax-figure@desktop /assets/kurama.jpg | oversized: 1024x1024 natural for 282x282 CSS px at DPR 1 (3.6x needed resolution) |
| FAIL | products-baymax-figure@desktop /assets/kurama.jpg | 0.52 MB transferred (limit 0.5 MB) |
| FAIL | products-baymax-figure@desktop /assets/night-fury.jpg | oversized: 3000x4000 natural for 282x282 CSS px at DPR 1 (14.2x needed resolution) |
| FAIL | products-baymax-figure@desktop /assets/night-fury.jpg | 2.41 MB transferred (limit 0.5 MB) |
| INFO | products-baymax-figure@desktop /assets/night-fury.jpg | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | products-baymax-figure@desktop /assets/night-fury.jpg | width/height attrs 640x640 disagree with intrinsic ratio 0.75 |
| FAIL | products-baymax-figure@desktop /assets/honeycomb-logo-web.png | oversized: 7435x2229 natural for 220x66 CSS px at DPR 1 (33.8x needed resolution) |
| FAIL | products-baymax-figure@desktop /assets/honeycomb-logo-web.png | decodes to 16.6 MP (~66 MB RGBA) |
| FAIL | products-baymax-figure@desktop page-image-bytes | 6.75 MB of images on /products/baymax-figure/ (limit 1.5 MB); LCP 164 ms (/assets/baymax.jpg) on local server |
| FAIL | products-kurama-figure@desktop /assets/honeycomb-logo-web.png | oversized: 7435x2229 natural for 220x66 CSS px at DPR 1 (33.8x needed resolution) |
| FAIL | products-kurama-figure@desktop /assets/honeycomb-logo-web.png | decodes to 16.6 MP (~66 MB RGBA) |
| FAIL | products-kurama-figure@desktop /assets/kurama.jpg | 0.52 MB transferred (limit 0.5 MB) |
| FAIL | products-kurama-figure@desktop /assets/hidden-leaf.jpg | oversized: 960x1280 natural for 282x282 CSS px at DPR 1 (4.5x needed resolution) |
| INFO | products-kurama-figure@desktop /assets/hidden-leaf.jpg | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | products-kurama-figure@desktop /assets/hidden-leaf.jpg | width/height attrs 640x640 disagree with intrinsic ratio 0.75 |
| FAIL | products-kurama-figure@desktop /assets/baymax.png | oversized: 1536x2048 natural for 282x282 CSS px at DPR 1 (7.3x needed resolution) |
| FAIL | products-kurama-figure@desktop /assets/baymax.png | 3.23 MB transferred (limit 0.5 MB) |
| INFO | products-kurama-figure@desktop /assets/baymax.png | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | products-kurama-figure@desktop /assets/baymax.png | width/height attrs 640x640 disagree with intrinsic ratio 0.75 |
| FAIL | products-kurama-figure@desktop /assets/night-fury.jpg | oversized: 3000x4000 natural for 282x282 CSS px at DPR 1 (14.2x needed resolution) |
| FAIL | products-kurama-figure@desktop /assets/night-fury.jpg | 2.41 MB transferred (limit 0.5 MB) |
| INFO | products-kurama-figure@desktop /assets/night-fury.jpg | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | products-kurama-figure@desktop /assets/night-fury.jpg | width/height attrs 640x640 disagree with intrinsic ratio 0.75 |
| FAIL | products-kurama-figure@desktop /assets/honeycomb-logo-web.png | oversized: 7435x2229 natural for 220x66 CSS px at DPR 1 (33.8x needed resolution) |
| FAIL | products-kurama-figure@desktop /assets/honeycomb-logo-web.png | decodes to 16.6 MP (~66 MB RGBA) |
| FAIL | products-kurama-figure@desktop page-image-bytes | 6.75 MB of images on /products/kurama-figure/ (limit 1.5 MB); LCP 116 ms (/assets/kurama.jpg) on local server |
| FAIL | products-night-fury-keychain@desktop /assets/honeycomb-logo-web.png | oversized: 7435x2229 natural for 220x66 CSS px at DPR 1 (33.8x needed resolution) |
| FAIL | products-night-fury-keychain@desktop /assets/honeycomb-logo-web.png | decodes to 16.6 MP (~66 MB RGBA) |
| FAIL | products-night-fury-keychain@desktop /assets/night-fury.jpg | oversized: 3000x4000 natural for 570x570 CSS px at DPR 1 (7.0x needed resolution) |
| FAIL | products-night-fury-keychain@desktop /assets/night-fury.jpg | 2.41 MB transferred (limit 0.5 MB) |
| INFO | products-night-fury-keychain@desktop /assets/night-fury.jpg | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | products-night-fury-keychain@desktop /assets/night-fury.jpg | width/height attrs 640x640 disagree with intrinsic ratio 0.75 |
| FAIL | products-night-fury-keychain@desktop /assets/hidden-leaf.jpg | oversized: 960x1280 natural for 282x282 CSS px at DPR 1 (4.5x needed resolution) |
| INFO | products-night-fury-keychain@desktop /assets/hidden-leaf.jpg | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | products-night-fury-keychain@desktop /assets/hidden-leaf.jpg | width/height attrs 640x640 disagree with intrinsic ratio 0.75 |
| FAIL | products-night-fury-keychain@desktop /assets/baymax.png | oversized: 1536x2048 natural for 282x282 CSS px at DPR 1 (7.3x needed resolution) |
| FAIL | products-night-fury-keychain@desktop /assets/baymax.png | 3.23 MB transferred (limit 0.5 MB) |
| INFO | products-night-fury-keychain@desktop /assets/baymax.png | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | products-night-fury-keychain@desktop /assets/baymax.png | width/height attrs 640x640 disagree with intrinsic ratio 0.75 |
| FAIL | products-night-fury-keychain@desktop /assets/kurama.jpg | oversized: 1024x1024 natural for 282x282 CSS px at DPR 1 (3.6x needed resolution) |
| FAIL | products-night-fury-keychain@desktop /assets/kurama.jpg | 0.52 MB transferred (limit 0.5 MB) |
| FAIL | products-night-fury-keychain@desktop /assets/honeycomb-logo-web.png | oversized: 7435x2229 natural for 220x66 CSS px at DPR 1 (33.8x needed resolution) |
| FAIL | products-night-fury-keychain@desktop /assets/honeycomb-logo-web.png | decodes to 16.6 MP (~66 MB RGBA) |
| FAIL | products-night-fury-keychain@desktop page-image-bytes | 6.75 MB of images on /products/night-fury-keychain/ (limit 1.5 MB); LCP 560 ms (/assets/night-fury.jpg) on local server |
| FAIL | products-minato-kunai@desktop /assets/honeycomb-logo-web.png | oversized: 7435x2229 natural for 220x66 CSS px at DPR 1 (33.8x needed resolution) |
| FAIL | products-minato-kunai@desktop /assets/honeycomb-logo-web.png | decodes to 16.6 MP (~66 MB RGBA) |
| FAIL | products-minato-kunai@desktop /assets/hidden-leaf.jpg | oversized: 960x1280 natural for 282x282 CSS px at DPR 1 (4.5x needed resolution) |
| INFO | products-minato-kunai@desktop /assets/hidden-leaf.jpg | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | products-minato-kunai@desktop /assets/hidden-leaf.jpg | width/height attrs 640x640 disagree with intrinsic ratio 0.75 |
| FAIL | products-minato-kunai@desktop /assets/baymax.png | oversized: 1536x2048 natural for 282x282 CSS px at DPR 1 (7.3x needed resolution) |
| FAIL | products-minato-kunai@desktop /assets/baymax.png | 3.23 MB transferred (limit 0.5 MB) |
| INFO | products-minato-kunai@desktop /assets/baymax.png | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | products-minato-kunai@desktop /assets/baymax.png | width/height attrs 640x640 disagree with intrinsic ratio 0.75 |
| FAIL | products-minato-kunai@desktop /assets/kurama.jpg | oversized: 1024x1024 natural for 282x282 CSS px at DPR 1 (3.6x needed resolution) |
| FAIL | products-minato-kunai@desktop /assets/kurama.jpg | 0.52 MB transferred (limit 0.5 MB) |
| FAIL | products-minato-kunai@desktop /assets/honeycomb-logo-web.png | oversized: 7435x2229 natural for 220x66 CSS px at DPR 1 (33.8x needed resolution) |
| FAIL | products-minato-kunai@desktop /assets/honeycomb-logo-web.png | decodes to 16.6 MP (~66 MB RGBA) |
| FAIL | products-minato-kunai@desktop page-image-bytes | 4.81 MB of images on /products/minato-kunai/ (limit 1.5 MB); LCP 132 ms (/assets/minato-kunai.jpg) on local server |
| FAIL | products-light-fury-keychain@desktop /assets/honeycomb-logo-web.png | oversized: 7435x2229 natural for 220x66 CSS px at DPR 1 (33.8x needed resolution) |
| FAIL | products-light-fury-keychain@desktop /assets/honeycomb-logo-web.png | decodes to 16.6 MP (~66 MB RGBA) |
| FAIL | products-light-fury-keychain@desktop /assets/hidden-leaf.jpg | oversized: 960x1280 natural for 282x282 CSS px at DPR 1 (4.5x needed resolution) |
| INFO | products-light-fury-keychain@desktop /assets/hidden-leaf.jpg | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | products-light-fury-keychain@desktop /assets/hidden-leaf.jpg | width/height attrs 640x640 disagree with intrinsic ratio 0.75 |
| FAIL | products-light-fury-keychain@desktop /assets/baymax.png | oversized: 1536x2048 natural for 282x282 CSS px at DPR 1 (7.3x needed resolution) |
| FAIL | products-light-fury-keychain@desktop /assets/baymax.png | 3.23 MB transferred (limit 0.5 MB) |
| INFO | products-light-fury-keychain@desktop /assets/baymax.png | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | products-light-fury-keychain@desktop /assets/baymax.png | width/height attrs 640x640 disagree with intrinsic ratio 0.75 |
| FAIL | products-light-fury-keychain@desktop /assets/kurama.jpg | oversized: 1024x1024 natural for 282x282 CSS px at DPR 1 (3.6x needed resolution) |
| FAIL | products-light-fury-keychain@desktop /assets/kurama.jpg | 0.52 MB transferred (limit 0.5 MB) |
| FAIL | products-light-fury-keychain@desktop /assets/honeycomb-logo-web.png | oversized: 7435x2229 natural for 220x66 CSS px at DPR 1 (33.8x needed resolution) |
| FAIL | products-light-fury-keychain@desktop /assets/honeycomb-logo-web.png | decodes to 16.6 MP (~66 MB RGBA) |
| FAIL | products-light-fury-keychain@desktop page-image-bytes | 4.68 MB of images on /products/light-fury-keychain/ (limit 1.5 MB); LCP 132 ms (/assets/light-fury.jpg) on local server |
| FAIL | products-classic-kunai@desktop /assets/honeycomb-logo-web.png | oversized: 7435x2229 natural for 220x66 CSS px at DPR 1 (33.8x needed resolution) |
| FAIL | products-classic-kunai@desktop /assets/honeycomb-logo-web.png | decodes to 16.6 MP (~66 MB RGBA) |
| FAIL | products-classic-kunai@desktop /assets/hidden-leaf.jpg | oversized: 960x1280 natural for 282x282 CSS px at DPR 1 (4.5x needed resolution) |
| INFO | products-classic-kunai@desktop /assets/hidden-leaf.jpg | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | products-classic-kunai@desktop /assets/hidden-leaf.jpg | width/height attrs 640x640 disagree with intrinsic ratio 0.75 |
| FAIL | products-classic-kunai@desktop /assets/baymax.png | oversized: 1536x2048 natural for 282x282 CSS px at DPR 1 (7.3x needed resolution) |
| FAIL | products-classic-kunai@desktop /assets/baymax.png | 3.23 MB transferred (limit 0.5 MB) |
| INFO | products-classic-kunai@desktop /assets/baymax.png | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | products-classic-kunai@desktop /assets/baymax.png | width/height attrs 640x640 disagree with intrinsic ratio 0.75 |
| FAIL | products-classic-kunai@desktop /assets/kurama.jpg | oversized: 1024x1024 natural for 282x282 CSS px at DPR 1 (3.6x needed resolution) |
| FAIL | products-classic-kunai@desktop /assets/kurama.jpg | 0.52 MB transferred (limit 0.5 MB) |
| FAIL | products-classic-kunai@desktop /assets/honeycomb-logo-web.png | oversized: 7435x2229 natural for 220x66 CSS px at DPR 1 (33.8x needed resolution) |
| FAIL | products-classic-kunai@desktop /assets/honeycomb-logo-web.png | decodes to 16.6 MP (~66 MB RGBA) |
| FAIL | products-classic-kunai@desktop page-image-bytes | 4.65 MB of images on /products/classic-kunai/ (limit 1.5 MB); LCP 124 ms (/assets/classic-kunai.jpg) on local server |
