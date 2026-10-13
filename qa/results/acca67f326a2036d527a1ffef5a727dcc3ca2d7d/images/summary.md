# Image audit

- Reviewed commit: `acca67f326a2036d527a1ffef5a727dcc3ca2d7d`
- Counts: {"INFO":58,"PASS":18,"FAIL":4}

## Assets

| Asset | Natural | Decodes | Largest rendered side (CSS px) | Alt text(s) |
|---|---|---|---|---|
| /assets/honeycomb-logo-web.png | 660x198 | yes | 220 | HoneyComb |
| /assets/baymax-1440.webp | 1440x1920 | yes | 350 | Two white 3D-printed Baymax figures photographed on a green display surface |
| /assets/hidden-leaf-960.webp | 960x422 | yes | 570 | White Hidden Leaf headband keychain with a black leaf symbol on a light backdrop |
| /assets/baymax-960.webp | 960x1280 | yes | 570 | Two white 3D-printed Baymax figures photographed on a green display surface |
| /assets/night-fury-960.webp | 960x720 | yes | 570 | A single black articulated Night Fury keychain with yellow-green eyes held in a hand |
| /assets/minato-kunai-960.webp | 960x2151 | yes | 570 | Black three-pronged Minato kunai with silver edge bevels, a tan engraved handle and a black ring on a light backdrop |
| /assets/light-fury-960.webp | 960x1280 | yes | 570 | A single painted white Light Fury keychain with blue eyes and black claws held in a hand |
| /assets/hidden-leaf-1440.webp | 1440x634 | yes | 350 | White Hidden Leaf headband keychain with a black leaf symbol on a light backdrop |
| /assets/night-fury-1440.webp | 1440x1080 | yes | 350 | A single black articulated Night Fury keychain with yellow-green eyes held in a hand |
| /assets/minato-kunai-1440.webp | 1440x3226 | yes | 350 | Black three-pronged Minato kunai with silver edge bevels, a tan engraved handle and a black ring on a light backdrop |
| /assets/light-fury-1440.webp | 1440x1920 | yes | 350 | A single painted white Light Fury keychain with blue eyes and black claws held in a hand |
| /assets/hidden-leaf-480.webp | 480x211 | yes | 282 | White Hidden Leaf headband keychain with a black leaf symbol on a light backdrop |
| /assets/baymax-480.webp | 480x640 | yes | 282 | Two white 3D-printed Baymax figures photographed on a green display surface |
| /assets/night-fury-480.webp | 480x360 | yes | 282 | A single black articulated Night Fury keychain with yellow-green eyes held in a hand |
| /assets/minato-kunai-480.webp | 480x1075 | yes | 282 | Black three-pronged Minato kunai with silver edge bevels, a tan engraved handle and a black ring on a light backdrop |
| /assets/light-fury-480.webp | 480x640 | yes | 282 | A single painted white Light Fury keychain with blue eyes and black claws held in a hand |

## Image bytes per page

- home@mobile: 0.43 MB
- shop@mobile: 0.37 MB
- products-hidden-leaf-keychain@mobile: 0.29 MB
- products-baymax-figure@mobile: 0.34 MB
- products-kurama-figure@mobile: 0.25 MB
- products-night-fury-keychain@mobile: 0.28 MB
- products-minato-kunai@mobile: 0.47 MB
- products-light-fury-keychain@mobile: 0.27 MB
- products-classic-kunai@mobile: 0.22 MB
- home@desktop: 0.23 MB
- shop@desktop: 0.17 MB
- products-hidden-leaf-keychain@desktop: 0.17 MB
- products-baymax-figure@desktop: 0.20 MB
- products-kurama-figure@desktop: 0.14 MB
- products-night-fury-keychain@desktop: 0.16 MB
- products-minato-kunai@desktop: 0.22 MB
- products-light-fury-keychain@desktop: 0.15 MB
- products-classic-kunai@desktop: 0.12 MB

## All checks

| Status | Check | Detail |
|---|---|---|
| INFO | home@mobile /assets/baymax-1440.webp | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | home@mobile /assets/hidden-leaf-960.webp | letterboxed (contain): image 2.27 in box 1.00 |
| INFO | home@mobile /assets/baymax-960.webp | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | home@mobile /assets/night-fury-960.webp | letterboxed (contain): image 1.33 in box 1.00 |
| PASS | home@mobile page-image-bytes | 0.43 MB of images on / (limit 1.5 MB); LCP 64 ms (text) on local server |
| INFO | shop@mobile /assets/hidden-leaf-960.webp | letterboxed (contain): image 2.27 in box 1.00 |
| INFO | shop@mobile /assets/baymax-960.webp | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | shop@mobile /assets/night-fury-960.webp | letterboxed (contain): image 1.33 in box 1.00 |
| FAIL | shop@mobile /assets/minato-kunai-960.webp | oversized: 960x2151 natural for 167x167 CSS px at DPR 3 (4.3x needed resolution) |
| INFO | shop@mobile /assets/minato-kunai-960.webp | letterboxed (contain): image 0.45 in box 1.00 |
| INFO | shop@mobile /assets/light-fury-960.webp | letterboxed (contain): image 0.75 in box 1.00 |
| PASS | shop@mobile page-image-bytes | 0.37 MB of images on /shop/ (limit 1.5 MB); LCP 60 ms (text) on local server |
| INFO | products-hidden-leaf-keychain@mobile /assets/hidden-leaf-1440.webp | letterboxed (contain): image 2.27 in box 1.00 |
| INFO | products-hidden-leaf-keychain@mobile /assets/baymax-960.webp | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | products-hidden-leaf-keychain@mobile /assets/night-fury-960.webp | letterboxed (contain): image 1.33 in box 1.00 |
| PASS | products-hidden-leaf-keychain@mobile page-image-bytes | 0.29 MB of images on /products/hidden-leaf-keychain/ (limit 1.5 MB); LCP 56 ms (/assets/hidden-leaf-1440.webp) on local server |
| INFO | products-baymax-figure@mobile /assets/baymax-1440.webp | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | products-baymax-figure@mobile /assets/hidden-leaf-960.webp | letterboxed (contain): image 2.27 in box 1.00 |
| INFO | products-baymax-figure@mobile /assets/night-fury-960.webp | letterboxed (contain): image 1.33 in box 1.00 |
| PASS | products-baymax-figure@mobile page-image-bytes | 0.34 MB of images on /products/baymax-figure/ (limit 1.5 MB); LCP 40 ms (/assets/baymax-1440.webp) on local server |
| INFO | products-kurama-figure@mobile /assets/hidden-leaf-960.webp | letterboxed (contain): image 2.27 in box 1.00 |
| INFO | products-kurama-figure@mobile /assets/baymax-960.webp | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | products-kurama-figure@mobile /assets/night-fury-960.webp | letterboxed (contain): image 1.33 in box 1.00 |
| PASS | products-kurama-figure@mobile page-image-bytes | 0.25 MB of images on /products/kurama-figure/ (limit 1.5 MB); LCP 48 ms (text) on local server |
| INFO | products-night-fury-keychain@mobile /assets/night-fury-1440.webp | letterboxed (contain): image 1.33 in box 1.00 |
| INFO | products-night-fury-keychain@mobile /assets/hidden-leaf-960.webp | letterboxed (contain): image 2.27 in box 1.00 |
| INFO | products-night-fury-keychain@mobile /assets/baymax-960.webp | letterboxed (contain): image 0.75 in box 1.00 |
| PASS | products-night-fury-keychain@mobile page-image-bytes | 0.28 MB of images on /products/night-fury-keychain/ (limit 1.5 MB); LCP 44 ms (/assets/night-fury-1440.webp) on local server |
| FAIL | products-minato-kunai@mobile /assets/minato-kunai-1440.webp | oversized: 1440x3226 natural for 350x350 CSS px at DPR 3 (3.1x needed resolution) |
| INFO | products-minato-kunai@mobile /assets/minato-kunai-1440.webp | letterboxed (contain): image 0.45 in box 1.00 |
| INFO | products-minato-kunai@mobile /assets/hidden-leaf-960.webp | letterboxed (contain): image 2.27 in box 1.00 |
| INFO | products-minato-kunai@mobile /assets/baymax-960.webp | letterboxed (contain): image 0.75 in box 1.00 |
| PASS | products-minato-kunai@mobile page-image-bytes | 0.47 MB of images on /products/minato-kunai/ (limit 1.5 MB); LCP 48 ms (/assets/minato-kunai-1440.webp) on local server |
| INFO | products-light-fury-keychain@mobile /assets/light-fury-1440.webp | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | products-light-fury-keychain@mobile /assets/hidden-leaf-960.webp | letterboxed (contain): image 2.27 in box 1.00 |
| INFO | products-light-fury-keychain@mobile /assets/baymax-960.webp | letterboxed (contain): image 0.75 in box 1.00 |
| PASS | products-light-fury-keychain@mobile page-image-bytes | 0.27 MB of images on /products/light-fury-keychain/ (limit 1.5 MB); LCP 48 ms (/assets/light-fury-1440.webp) on local server |
| INFO | products-classic-kunai@mobile /assets/hidden-leaf-960.webp | letterboxed (contain): image 2.27 in box 1.00 |
| INFO | products-classic-kunai@mobile /assets/baymax-960.webp | letterboxed (contain): image 0.75 in box 1.00 |
| PASS | products-classic-kunai@mobile page-image-bytes | 0.22 MB of images on /products/classic-kunai/ (limit 1.5 MB); LCP 48 ms (text) on local server |
| INFO | home@desktop /assets/baymax-960.webp | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | home@desktop /assets/hidden-leaf-480.webp | letterboxed (contain): image 2.27 in box 1.00 |
| INFO | home@desktop /assets/baymax-480.webp | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | home@desktop /assets/night-fury-480.webp | letterboxed (contain): image 1.33 in box 1.00 |
| PASS | home@desktop page-image-bytes | 0.23 MB of images on / (limit 1.5 MB); LCP 68 ms (/assets/baymax-960.webp) on local server |
| INFO | shop@desktop /assets/hidden-leaf-480.webp | letterboxed (contain): image 2.27 in box 1.00 |
| INFO | shop@desktop /assets/baymax-480.webp | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | shop@desktop /assets/night-fury-480.webp | letterboxed (contain): image 1.33 in box 1.00 |
| FAIL | shop@desktop /assets/minato-kunai-480.webp | oversized: 480x1075 natural for 282x282 CSS px at DPR 1 (3.8x needed resolution) |
| INFO | shop@desktop /assets/minato-kunai-480.webp | letterboxed (contain): image 0.45 in box 1.00 |
| INFO | shop@desktop /assets/light-fury-480.webp | letterboxed (contain): image 0.75 in box 1.00 |
| PASS | shop@desktop page-image-bytes | 0.17 MB of images on /shop/ (limit 1.5 MB); LCP 72 ms (text) on local server |
| INFO | products-hidden-leaf-keychain@desktop /assets/hidden-leaf-960.webp | letterboxed (contain): image 2.27 in box 1.00 |
| INFO | products-hidden-leaf-keychain@desktop /assets/baymax-480.webp | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | products-hidden-leaf-keychain@desktop /assets/night-fury-480.webp | letterboxed (contain): image 1.33 in box 1.00 |
| PASS | products-hidden-leaf-keychain@desktop page-image-bytes | 0.17 MB of images on /products/hidden-leaf-keychain/ (limit 1.5 MB); LCP 60 ms (/assets/hidden-leaf-960.webp) on local server |
| INFO | products-baymax-figure@desktop /assets/baymax-960.webp | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | products-baymax-figure@desktop /assets/hidden-leaf-480.webp | letterboxed (contain): image 2.27 in box 1.00 |
| INFO | products-baymax-figure@desktop /assets/night-fury-480.webp | letterboxed (contain): image 1.33 in box 1.00 |
| PASS | products-baymax-figure@desktop page-image-bytes | 0.20 MB of images on /products/baymax-figure/ (limit 1.5 MB); LCP 68 ms (/assets/baymax-960.webp) on local server |
| INFO | products-kurama-figure@desktop /assets/hidden-leaf-480.webp | letterboxed (contain): image 2.27 in box 1.00 |
| INFO | products-kurama-figure@desktop /assets/baymax-480.webp | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | products-kurama-figure@desktop /assets/night-fury-480.webp | letterboxed (contain): image 1.33 in box 1.00 |
| PASS | products-kurama-figure@desktop page-image-bytes | 0.14 MB of images on /products/kurama-figure/ (limit 1.5 MB); LCP 76 ms (text) on local server |
| INFO | products-night-fury-keychain@desktop /assets/night-fury-960.webp | letterboxed (contain): image 1.33 in box 1.00 |
| INFO | products-night-fury-keychain@desktop /assets/hidden-leaf-480.webp | letterboxed (contain): image 2.27 in box 1.00 |
| INFO | products-night-fury-keychain@desktop /assets/baymax-480.webp | letterboxed (contain): image 0.75 in box 1.00 |
| PASS | products-night-fury-keychain@desktop page-image-bytes | 0.16 MB of images on /products/night-fury-keychain/ (limit 1.5 MB); LCP 72 ms (/assets/night-fury-960.webp) on local server |
| FAIL | products-minato-kunai@desktop /assets/minato-kunai-960.webp | oversized: 960x2151 natural for 570x570 CSS px at DPR 1 (3.8x needed resolution) |
| INFO | products-minato-kunai@desktop /assets/minato-kunai-960.webp | letterboxed (contain): image 0.45 in box 1.00 |
| INFO | products-minato-kunai@desktop /assets/hidden-leaf-480.webp | letterboxed (contain): image 2.27 in box 1.00 |
| INFO | products-minato-kunai@desktop /assets/baymax-480.webp | letterboxed (contain): image 0.75 in box 1.00 |
| PASS | products-minato-kunai@desktop page-image-bytes | 0.22 MB of images on /products/minato-kunai/ (limit 1.5 MB); LCP 60 ms (/assets/minato-kunai-960.webp) on local server |
| INFO | products-light-fury-keychain@desktop /assets/light-fury-960.webp | letterboxed (contain): image 0.75 in box 1.00 |
| INFO | products-light-fury-keychain@desktop /assets/hidden-leaf-480.webp | letterboxed (contain): image 2.27 in box 1.00 |
| INFO | products-light-fury-keychain@desktop /assets/baymax-480.webp | letterboxed (contain): image 0.75 in box 1.00 |
| PASS | products-light-fury-keychain@desktop page-image-bytes | 0.15 MB of images on /products/light-fury-keychain/ (limit 1.5 MB); LCP 72 ms (/assets/light-fury-960.webp) on local server |
| INFO | products-classic-kunai@desktop /assets/hidden-leaf-480.webp | letterboxed (contain): image 2.27 in box 1.00 |
| INFO | products-classic-kunai@desktop /assets/baymax-480.webp | letterboxed (contain): image 0.75 in box 1.00 |
| PASS | products-classic-kunai@desktop page-image-bytes | 0.12 MB of images on /products/classic-kunai/ (limit 1.5 MB); LCP 64 ms (text) on local server |
