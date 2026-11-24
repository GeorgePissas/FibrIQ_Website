# FibrIQ website

This is a build-free, single-page prototype for FibrIQ. It runs with HTML, CSS, JavaScript and local assets. The modules, pilots and tool integration described on the site are concepts under development. The charts and pitch animations are engineering illustrations.

## Preview locally

Open `index.html` in your browser for a quick private preview. To preview the same files over HTTP, open a terminal in this folder and run:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Open [http://127.0.0.1:8000/](http://127.0.0.1:8000/) and refresh after editing. If Windows exposes Python as `py`, use `py -m http.server 8000 --bind 127.0.0.1`. Press Ctrl+C in the terminal to stop the server. Use the browser’s responsive design mode to preview phone and tablet layouts.

## Maintain the site

| Path | What to edit |
| --- | --- |
| `index.html` | Page copy, sections, navigation, image descriptions and sharing metadata |
| `styles.css` | Colours, typography, spacing and responsive layouts |
| `config.js` | Public email, social links and team profiles |
| `script.js` | Menu, bracket views, fibre-angle chart and module selector |
| `assets/logos/` | Wordmark and favicon |
| `assets/products/` | Individual module artwork |
| `assets/illustrations/` | Bracket views, phase-field image and social sharing card |
| `assets/animations/` | Video clips and still previews |

Keep paths relative to the site root so the site also works at a GitHub Pages project URL. When replacing a figure, update the image path, dimensions and alternative text together.

To add people, place their portraits in `assets/images/` and add an object per person in `config.js` with `name`, `role`, `bio` and `portrait`. Portraits are optional. The short team placeholder disappears when the first profile is added. Set `contactEmail` and add confirmed HTTPS links to `socialLinks` to display them in the Contact section and footer.

## Asset sources

- The wordmark, F emblem and bracket artwork come from the supplied brand and science PNGs.
- Design, Print and Cloud use original standalone pitch artwork. Sim and Live are cropped from a high-resolution render of the final slide. The website rebuilds the module ring in HTML and CSS.
- The cantilever clips use the supplied short- and continuous-fibre GIFs. The print-tool concept comes from the animation embedded in the PowerPoint. The clips use compressed MP4 files with still previews. The pitch PDF contains static frames.
- The interactive fibre-angle graph uses synthetic curves based on the pitch illustration. The sharing card combines the original wordmark and bracket artwork.

The root-level pitch decks and original images are working source files and excluded by `.gitignore`. Deployment uses the website files and the optimised `assets/` directory.

## Publish with GitHub Pages

GitHub Pages is the intended first option for publishing the informational prototype. GitHub Free supports Pages from public repositories. Review GitHub’s usage limits before any launch that would run an online business, facilitate commercial transactions or operate a commercial SaaS. [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)

1. After approving publication, create a public GitHub repository and push the website files on `main`. Keep `index.html`, `.nojekyll` and `assets/` at the repository root. Review the files being pushed because both the repository and the deployed site will be public.
2. In the repository’s **Settings → Pages**, choose **Deploy from a branch**, then **main** and **/ (root)**. Save, and use the address shown in Pages once the deployment completes. [Publishing source documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
3. Once the public URL is known, set `og:image` in `index.html` to the full public URL of `assets/illustrations/share.jpg`. Add matching absolute `og:url` and canonical URLs using the deployed page address. The initial prototype uses a relative image path for portability.

### Optional custom domain

The default GitHub Pages address works without buying a domain. If you already own one, add it under **Settings → Pages → Custom domain**, then follow GitHub’s instructions for the appropriate DNS records. A subdomain normally uses a CNAME to the account’s Pages hostname. For an apex domain, use the records listed by GitHub. Once DNS is verified, enable HTTPS and update the absolute sharing URLs. [GitHub custom domain documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)

## Alternative hosting

Cloudflare Pages is an optional static hosting provider. The same repository works there. In **Workers & Pages**, import the repository as a Pages project and set the production branch to `main`, the build command to `exit 0` and the output directory to the repository root (`.`). For an optional custom domain, add the domain in the Pages project before configuring DNS. Review the provider’s current terms and limits when choosing hosting for production. [Static HTML deployment](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/) · [Custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)
