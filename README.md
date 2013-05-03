# A Blank Template for Open Web Apps

**Warning**: the contents in this tempate are deprected, and will soon be replaced by a much different structure. Volo and several other things will be removed to offer a simpler and more extensible template.

The is a minimal template that has a little HTML, CSS, and js to help
you start writing an Open Web App.

This is part of the [mortar](https://github.com/mozilla/mortar/)
template collection for building Open Web Apps.

# Usage

There are a few ways to get this template:

* git clone git://github.com/mozilla/mortar-app-stub.git myapp
* volo create myapp mozilla/mortar-app-stub

If you have node installed, you can run a development server with volo:

1. cd myapp
2. volo serve

View the app at http://localhost:8008/.


# A Hacker News reader for Firefox OS (aka boot2gecko)

**Warning**: This program is unfinished and may have devastating bugs or features not yet implemented. If your computer explodes because of a bug, you go into permanent depression because of a missing feature, or any other bad outcome, I take no responsibility for it.

# Usage
* Clone the repo into your most favorite directory ever
* 'volo build' that sucker (install volo if you don't already have it)
* Add it to your Firefox OS simulator/emulator/device
* Enjoy Hacker News without squinting

# !!NB!! This webapp requires systemXHR, until app is submited to Mozilla marketplace you will need to ensure your device allows this. !!NB!!

# Feature List
* Native and clean Firefox OS Design
* Pull in front page articles, and relevant metadata
* Display Articles in-app
* Open in browser button
* In-app Navigation

# TODO
* Parse and pretty-print comments, currently opening comments page does nothing
* Rework UX, esp. font size
* Test on actual hardware
* Load more than first 30 articles
* Become the very best that no-one ever was
* Parse news and job offer posts properly