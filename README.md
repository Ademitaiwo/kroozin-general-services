# KROOZ'IN GENERAL SERVICES NIGERIA LIMITED — Website

Responsive, multi-page HTML/CSS/JavaScript corporate website prepared from the supplied KROOZ'IN letterhead and Word website-content document.

## Main pages
- index.html
- about.html
- services.html
- products.html
- industries.html
- why-choose-us.html
- faqs.html
- contact.html

## Service pages
- facility-management.html
- cleaning-services.html
- general-maintenance.html
- procurement.html
- general-supplies.html
- logistics-haulage.html
- distribution-warehousing.html
- environmental-services.html
- import-export.html
- contract-supplies.html

## Run
Open `index.html` in a browser. No build tool is required.

VS Code + Live Server is recommended for development.

## Contact form
The quote form currently prepares an email using `mailto:`. It does not send data to a server. Before launch, connect it to the client's approved form backend.

## Client verification before launch
The supplied materials contain slightly different spellings for the website/email domain (`kroozln.com` / `kroozin.com`). The current build follows the Word-document spelling in the email links; verify the official domain/email details with KROOZ'IN before deployment.

## Local visual service illustrations
Service illustrations are stored locally in `assets/images/services/`, so the pages display visuals without relying on external image hotlinks.

## Photography update

The service illustrations have been replaced in the HTML with professional Pexels photographs, including several photographs specifically identified as Lagos/Nigeria scenes. The pages use the Pexels CDN URLs directly so the photos load when the site is online. Local SVG illustrations remain in `assets/images/services/` as fallbacks if a remote image cannot be reached.

Selected photo sources include Pexels images from Lagos/Nigeria for corporate collaboration, warehouse operations, environmental work, port/logistics, and road construction, plus professional service imagery for cleaning and delivery.


## Nigeria-focused photography
The photographic version uses Pexels-hosted stock photographs selected to be Nigeria-specific wherever the service is location-sensitive. The current image set includes verified Lagos/Nigeria photographs for: Lagos port/import-export, Lagos logistics/courier, Lagos maintenance/construction, Nigerian cleaning/sanitation, Nigerian recycling/environmental work, Lagos warehouses, Lagos corporate offices, and Lagos facilities/buildings.

Image sources are referenced in the build notes and remain remote Pexels image URLs in the HTML. If the final production site needs the photographs bundled locally, download the selected images under their applicable Pexels license and place them in `assets/images/photos/`, then replace the remote URLs.
