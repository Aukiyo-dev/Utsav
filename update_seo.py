from pathlib import Path
import re, json

ROOT = Path('/mnt/data/seo_work')
BASE = 'https://utsav-countdown.vercel.app'
TODAY = '2026-09-01'

pages = {
    'durga': {
        'path':'durga-puja-countdown/', 'slug':'durga-puja-countdown',
        'title':'Durga Puja Countdown 2026 | Date, Days Left & Timer | Utsav',
        'description':'Durga Puja countdown 2026 with a live timer, 2026 Puja dates, days left, Shashthi through Vijayadashami information, and festive music on Utsav.',
        'image':'durga-puja.jpg', 'mobile':'durga-puja-mobile.jpg', 'name':'Durga Puja',
        'date':'Friday, 16 October 2026', 'iso':'2026-10-16T00:00:00+05:30',
        'intro':'<p><strong>Durga Puja Countdown 2026</strong> is live. Check the exact time remaining until the first Durga Puja day, including <strong>days, hours, minutes and seconds</strong>. The Utsav timer is designed for searches such as “Durga Puja countdown”, “Durga Puja 2026 how many days left” and “Durga Puja countdown 2026 date”.</p>',
        'content':'''<h2 id="festival-seo-title">Durga Puja Countdown 2026</h2>
<p>Wondering <strong>how many days are left for Durga Puja 2026</strong>? Utsav provides a live countdown that updates continuously, so the number shown above changes with the current time instead of using a fixed “days left” number.</p>

<h3>When is Durga Puja 2026?</h3>
<p>For this Utsav countdown, the target is <strong>Friday, 16 October 2026</strong>. The 2026 Bengal calendar places the Durga Puja sequence from <strong>16 October through 21 October 2026</strong>, with Saptami on 17 October, Ashtami on 19 October, Navami on 20 October and Vijayadashami on 21 October.</p>

<h3>Durga Puja 2026 dates</h3>
<ul>
<li><strong>16 October 2026:</strong> Durga Puja Day 1 / Shashthi in the referenced Bengal calendar.</li>
<li><strong>17 October 2026:</strong> Shashthi / Kalparambha and Akal Bodhon.</li>
<li><strong>18 October 2026:</strong> Durga Saptami.</li>
<li><strong>19 October 2026:</strong> Durga Ashtami and Sandhi Puja period.</li>
<li><strong>20 October 2026:</strong> Maha Navami.</li>
<li><strong>21 October 2026:</strong> Vijayadashami and Bengal Durga Visarjan.</li>
</ul>

<h3>How many days until Durga Puja 2026?</h3>
<p>The answer changes every day and every second. The live counter above automatically calculates the remaining time. If you search for <strong>Durga Puja countdown days left</strong>, this page gives you the live value rather than a stale countdown article.</p>

<h3>Why is Durga Puja celebrated?</h3>
<p>Durga Puja is a major Hindu festival dedicated to Goddess Durga. In Bengal, the festival is celebrated through worship, cultural programmes, community gatherings, artistic pandals and the traditions surrounding the final days of the Puja.</p>

<h3>Durga Puja countdown with festive music</h3>
<p>Utsav combines the live timer with a festive YouTube music player. You can use the countdown for the date and the player for music while waiting for Puja.</p>

<h3>Frequently asked questions</h3>
<details><summary>What date is Durga Puja in 2026?</summary><p>The Utsav countdown target is Friday, 16 October 2026. The referenced Bengal calendar continues through Vijayadashami on Wednesday, 21 October 2026.</p></details>
<details><summary>How many days are left for Durga Puja 2026?</summary><p>The exact number changes continuously. Use the live countdown at the top of this page for the current days, hours, minutes and seconds remaining.</p></details>
<details><summary>When is Durga Saptami in 2026?</summary><p>The referenced Bengal calendar lists Durga Saptami on Sunday, 18 October 2026.</p></details>
<details><summary>When is Vijayadashami in 2026?</summary><p>The referenced Bengal calendar lists Vijayadashami on Wednesday, 21 October 2026.</p></details>'''
    },
    'kali': {
        'path':'kali-puja-countdown/', 'slug':'kali-puja-countdown',
        'title':'Kali Puja Countdown 2026 | Date, Days Left & Timer | Utsav',
        'description':'Kali Puja countdown 2026 with a live timer, Kali Puja date, days left, Shyama Puja information, and festive music on Utsav.',
        'image':'kali-puja.jpg', 'mobile':'kali-puja-mobile.jpg', 'name':'Kali Puja',
        'date':'Sunday, 8 November 2026', 'iso':'2026-11-08T00:00:00+05:30',
        'intro':'<p><strong>Kali Puja Countdown 2026</strong> is live. Check the exact days, hours, minutes and seconds remaining until <strong>Sunday, 8 November 2026</strong>. This page is built for searches such as “Kali Puja countdown”, “Kali Puja 2026” and “Kali Puja countdown days left”.</p>',
        'content':'''<h2 id="festival-seo-title">Kali Puja Countdown 2026</h2>
<p>Looking for a live <strong>Kali Puja countdown</strong>? Utsav continuously calculates the remaining time until <strong>Sunday, 8 November 2026</strong>, so you can see the current days, hours, minutes and seconds instead of relying on a static number.</p>

<h3>When is Kali Puja 2026?</h3>
<p><strong>Kali Puja 2026 is on Sunday, 8 November 2026.</strong> Kali Puja is also known as <strong>Shyama Puja</strong> and is observed on the new-moon night during the Diwali period. Local Puja timings depend on the location and the relevant lunar calculations.</p>

<h3>Kali Puja 2026 date and time</h3>
<p>The Utsav countdown target is <strong>8 November 2026</strong>. If you need an exact local Nishita or Puja muhurat, use a location-specific Panchang because the clock time can vary by place. The purpose of this page is to provide a simple, live <strong>Kali Puja countdown timer</strong>.</p>

<h3>How many days until Kali Puja 2026?</h3>
<p>The remaining time changes continuously. The counter above shows the current <strong>Kali Puja countdown in days, hours, minutes and seconds</strong>, answering the common “how many days are left?” search directly.</p>

<h3>What is Kali Puja?</h3>
<p>Kali Puja is a Hindu festival dedicated to Goddess Kali. In West Bengal and other parts of eastern India, it is an important part of the Diwali-period celebrations, with worship taking place at homes, temples and community spaces.</p>

<h3>Kali Puja countdown with festive music</h3>
<p>Utsav pairs the live countdown with a festive YouTube music player, giving visitors a single place to check the date, watch the timer and enjoy festival music.</p>

<h3>Frequently asked questions</h3>
<details><summary>What date is Kali Puja in 2026?</summary><p>Kali Puja 2026 is on Sunday, 8 November 2026.</p></details>
<details><summary>How many days are left for Kali Puja?</summary><p>The exact number changes every day. The live Utsav countdown shows the current remaining days, hours, minutes and seconds.</p></details>
<details><summary>Is Kali Puja also called Shyama Puja?</summary><p>Yes. Kali Puja is also known as Shyama Puja.</p></details>
<details><summary>Is Kali Puja on the same day as Diwali in 2026?</summary><p>For 2026, the referenced Bengal festival calendars place Kali Puja and Diwali on Sunday, 8 November 2026.</p></details>'''
    },
    'mahalaya': {
        'path':'mahalaya-countdown/', 'slug':'mahalaya-countdown',
        'title':'Mahalaya Countdown 2026 | Date, Days Left & Timer | Utsav',
        'description':'Mahalaya countdown 2026 with a live timer, Mahalaya date, days left, Mahishasura Mardini context, and nostalgic Mahalaya music on Utsav.',
        'image':'mahalaya.jpg', 'mobile':'mahalaya-mobile.jpg', 'name':'Mahalaya',
        'date':'Saturday, 10 October 2026', 'iso':'2026-10-10T00:00:00+05:30',
        'intro':'<p><strong>Mahalaya Countdown 2026</strong> is live. See exactly how many days, hours, minutes and seconds remain until <strong>Saturday, 10 October 2026</strong>. The timer updates continuously, making this page useful for “Mahalaya countdown”, “Mahalaya 2026 countdown” and “Mahalaya countdown from today” searches.</p>',
        'content':'''<h2 id="festival-seo-title">Mahalaya Countdown 2026</h2>
<p>Looking for a live <strong>Mahalaya countdown</strong>? Utsav shows the remaining time until <strong>Saturday, 10 October 2026</strong> and updates the counter continuously, so the days-left figure stays current.</p>

<h3>When is Mahalaya 2026?</h3>
<p><strong>Mahalaya 2026 is on Saturday, 10 October 2026.</strong> It is associated with the end of Pitru Paksha and the beginning of the festive period leading toward Durga Puja. In Bengali households, the morning is strongly associated with devotional recitation and the Mahishasura Mardini broadcast.</p>

<h3>Mahalaya 2026 date and countdown</h3>
<p>The Utsav countdown target is <strong>10 October 2026</strong>. Instead of publishing a fixed number of days, the live timer recalculates the remaining days, hours, minutes and seconds whenever you visit.</p>

<h3>How many days until Mahalaya 2026?</h3>
<p>The answer changes continuously. Use the live counter above to see the current <strong>Mahalaya countdown days left</strong> without doing the calculation yourself.</p>

<h3>Mahalaya morning and Mahishasura Mardini</h3>
<p>Mahalaya morning has a special place in Bengali cultural memory. Many people traditionally begin the day with devotional listening and the familiar Mahishasura Mardini programme, making the morning an important emotional marker for the approaching Durga Puja season.</p>

<h3>Mahalaya music on Utsav</h3>
<p>Utsav includes two separate Mahalaya YouTube playlist choices: <strong>Iconic Mahalaya</strong> and <strong>Mahalaya Collection</strong>. They can be selected from the music section of this page.</p>

<h3>Frequently asked questions</h3>
<details><summary>What date is Mahalaya in 2026?</summary><p>Mahalaya 2026 is on Saturday, 10 October 2026.</p></details>
<details><summary>How many days are left for Mahalaya?</summary><p>The exact number changes continuously. The live Utsav countdown shows the current remaining days, hours, minutes and seconds.</p></details>
<details><summary>Does Utsav have Mahalaya songs?</summary><p>Yes. Utsav has two Mahalaya playlist choices available from the Mahalaya page.</p></details>'''
    }
}


def schema_for(p):
    url=f"{BASE}/{p['path']}"
    img=f"{BASE}/{p['image']}"
    return {
      "@context":"https://schema.org",
      "@graph":[
        {"@type":"WebSite","@id":f"{BASE}/#website","url":f"{BASE}/","name":"Utsav","description":"Live countdowns for Durga Puja, Kali Puja and Mahalaya.","inLanguage":"en-IN"},
        {"@type":"WebPage","@id":f"{url}#webpage","url":url,"name":p['title'],"description":p['description'],"inLanguage":"en-IN","dateModified":TODAY,"isPartOf":{"@id":f"{BASE}/#website"},"about":{"@type":"Thing","name":p['name']},"primaryImageOfPage":{"@id":f"{url}#image"}},
        {"@type":"ImageObject","@id":f"{url}#image","url":img,"contentUrl":img,"caption":f"{p['name']} 2026 artwork"},
        {"@type":"BreadcrumbList","@id":f"{url}#breadcrumb","itemListElement":[{"@type":"ListItem","position":1,"name":"Utsav","item":f"{BASE}/"},{"@type":"ListItem","position":2,"name":f"{p['name']} Countdown 2026","item":url}]}
      ]
    }

def make_head(p):
    url=f"{BASE}/{p['path']}"
    img=f"{BASE}/{p['image']}"
    mobile=f"/{p['mobile']}"
    schema=json.dumps(schema_for(p), ensure_ascii=False, indent=2)
    return f'''<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#111016">
  <meta name="color-scheme" content="dark">
  <title>{p['title']}</title>
  <meta name="description" content="{p['description']}">
  <meta name="author" content="Utsav">
  <meta name="application-name" content="Utsav">
  <meta name="apple-mobile-web-app-title" content="Utsav">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="{url}">
  <link rel="icon" href="/{p['image']}" type="image/jpeg">
  <link rel="preload" as="image" href="/{p['image']}">
  <link rel="preload" as="image" href="{mobile}">
  <link rel="preconnect" href="https://www.youtube.com">
  <link rel="preconnect" href="https://i.ytimg.com">

  <meta property="og:type" content="website">
  <meta property="og:url" content="{url}">
  <meta property="og:title" content="{p['title']}">
  <meta property="og:description" content="{p['description']}">
  <meta property="og:site_name" content="Utsav">
  <meta property="og:locale" content="en_IN">
  <meta property="og:image" content="{img}">
  <meta property="og:image:alt" content="{p['name']} 2026 festival artwork">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{p['title']}">
  <meta name="twitter:description" content="{p['description']}">
  <meta name="twitter:image" content="{img}">
  <meta name="twitter:image:alt" content="{p['name']} 2026 festival artwork">

  <script type="application/ld+json">
{schema}
  </script>

  <link rel="stylesheet" href="/style.css?v=20260901-5">
</head>'''

# Update subpages
for key,p in pages.items():
    path=ROOT/p['path']/ 'index.html'
    text=path.read_text(encoding='utf-8')
    text=re.sub(r'<head>.*?</head>', make_head(p), text, count=1, flags=re.S)
    # Make the primary H1 explicit and useful without changing JS hooks.
    text=text.replace(f'<h1 id="festivalTitle">{p["name"]}</h1>', f'<h1 id="festivalTitle">{p["name"]} Countdown 2026</h1>')
    # Replace the generic visible SEO intro.
    text=re.sub(r'<section class="seo-intro" aria-label="About Utsav">.*?</section>', f'<section class="seo-intro" aria-label="{p["name"]} countdown introduction">{p["intro"]}</section>', text, count=1, flags=re.S)
    # Replace the entire SEO content block, preserving the class hook used by CSS.
    links='''<div class="festival-links">
<a href="/durga-puja-countdown/">Durga Puja Countdown 2026</a>
<a href="/kali-puja-countdown/">Kali Puja Countdown 2026</a>
<a href="/mahalaya-countdown/">Mahalaya Countdown 2026</a>
</div>
<p class="seo-updated"><small>Page updated September 1, 2026.</small></p>'''
    new_section=f'''<section class="seo-content seo-collapsed" aria-labelledby="festival-seo-title">
  <details open>
    <summary>{p['name']} 2026 Information</summary>
    <div class="seo-body">
      {p['content']}
      {links}
    </div>
  </details>
</section>'''
    text=re.sub(r'<section class="seo-content seo-collapsed".*?</section>\s*<div class="playlist-modal"', new_section+'\n\n  <div class="playlist-modal"', text, count=1, flags=re.S)
    path.write_text(text, encoding='utf-8')

# Home page SEO head and content.
home=ROOT/'index.html'
text=home.read_text(encoding='utf-8')
home_title='Utsav — Durga Puja, Kali Puja & Mahalaya Countdown 2026'
home_desc='Live Durga Puja, Kali Puja and Mahalaya countdowns for 2026, with dates, days left, real-time timers and festive music on Utsav.'
home_schema={
 "@context":"https://schema.org","@graph":[
  {"@type":"WebSite","@id":f"{BASE}/#website","url":f"{BASE}/","name":"Utsav","description":home_desc,"inLanguage":"en-IN"},
  {"@type":"WebPage","@id":f"{BASE}/#webpage","url":f"{BASE}/","name":home_title,"description":home_desc,"inLanguage":"en-IN","dateModified":TODAY,"isPartOf":{"@id":f"{BASE}/#website"},"about":[{"@type":"Thing","name":"Durga Puja"},{"@type":"Thing","name":"Kali Puja"},{"@type":"Thing","name":"Mahalaya"}]},
  {"@type":"ItemList","@id":f"{BASE}/#festivals","name":"Utsav 2026 festival countdowns","itemListElement":[
   {"@type":"ListItem","position":1,"name":"Durga Puja Countdown 2026","url":f"{BASE}/durga-puja-countdown/"},
   {"@type":"ListItem","position":2,"name":"Kali Puja Countdown 2026","url":f"{BASE}/kali-puja-countdown/"},
   {"@type":"ListItem","position":3,"name":"Mahalaya Countdown 2026","url":f"{BASE}/mahalaya-countdown/"}
  ]}
 ]
}
head=f'''<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#111016">
  <meta name="color-scheme" content="dark">
  <title>{home_title}</title>
  <meta name="description" content="{home_desc}">
  <meta name="author" content="Utsav">
  <meta name="application-name" content="Utsav">
  <meta name="apple-mobile-web-app-title" content="Utsav">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="{BASE}/">
  <link rel="icon" href="/durga-puja.jpg" type="image/jpeg">
  <link rel="preload" as="image" href="/durga-puja.jpg">
  <link rel="preload" as="image" href="/durga-puja-mobile.jpg">
  <link rel="preconnect" href="https://www.youtube.com">
  <link rel="preconnect" href="https://i.ytimg.com">

  <meta property="og:type" content="website">
  <meta property="og:url" content="{BASE}/">
  <meta property="og:title" content="{home_title}">
  <meta property="og:description" content="{home_desc}">
  <meta property="og:site_name" content="Utsav">
  <meta property="og:locale" content="en_IN">
  <meta property="og:image" content="{BASE}/durga-puja.jpg">
  <meta property="og:image:alt" content="Durga Puja 2026 festival artwork">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{home_title}">
  <meta name="twitter:description" content="{home_desc}">
  <meta name="twitter:image" content="{BASE}/durga-puja.jpg">
  <meta name="twitter:image:alt" content="Durga Puja 2026 festival artwork">

  <script type="application/ld+json">
{json.dumps(home_schema,ensure_ascii=False,indent=2)}
  </script>

  <link rel="stylesheet" href="/style.css?v=20260901-5">
</head>'''
text=re.sub(r'<head>.*?</head>',head,text,count=1,flags=re.S)
text=text.replace('<h1 id="festivalTitle">Durga Puja</h1>','<h1 id="festivalTitle">Durga Puja Countdown 2026</h1>')
text=re.sub(r'<section class="seo-intro" aria-label="About Utsav">.*?</section>', '''<section class="seo-intro" aria-label="Utsav 2026 festival countdowns">
  <p><strong>Utsav</strong> brings the <strong>Durga Puja countdown 2026</strong>, <strong>Kali Puja countdown 2026</strong> and <strong>Mahalaya countdown 2026</strong> together in one live festival experience. Check dates and days left, then open the dedicated countdown page for each festival.</p>
</section>''', text, count=1, flags=re.S)
home_section='''<section class="seo-content seo-collapsed" aria-labelledby="utsav-about-title">
  <details open>
    <summary>Utsav 2026 Festival Countdown Information</summary>
    <div class="seo-body">
      <h2 id="utsav-about-title">Durga Puja, Kali Puja &amp; Mahalaya Countdown 2026</h2>
      <p>Utsav is a live 2026 festival countdown website for people who want to know <strong>how many days are left</strong> until Durga Puja, Kali Puja or Mahalaya. The timers update in real time instead of showing a fixed day count.</p>
      <h3>2026 festival dates</h3>
      <ul>
        <li><strong>Mahalaya:</strong> Saturday, 10 October 2026.</li>
        <li><strong>Durga Puja countdown target:</strong> Friday, 16 October 2026.</li>
        <li><strong>Kali Puja:</strong> Sunday, 8 November 2026.</li>
      </ul>
      <h3>Choose a live countdown</h3>
      <div class="festival-links">
        <a href="/durga-puja-countdown/">Durga Puja Countdown 2026</a>
        <a href="/kali-puja-countdown/">Kali Puja Countdown 2026</a>
        <a href="/mahalaya-countdown/">Mahalaya Countdown 2026</a>
      </div>
      <p class="seo-updated"><small>Page updated September 1, 2026.</small></p>
    </div>
  </details>
</section>'''
text=re.sub(r'<section class="seo-content seo-collapsed".*?</section>\s*<div class="playlist-modal"',home_section+'\n\n  <div class="playlist-modal"',text,count=1,flags=re.S)
home.write_text(text,encoding='utf-8')

# Sitemap: include image locations to strengthen image discovery, while keeping only canonical public URLs.
sitemap='''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url><loc>https://utsav-countdown.vercel.app/</loc><lastmod>2026-09-01</lastmod><image:image><image:loc>https://utsav-countdown.vercel.app/durga-puja.jpg</image:loc></image:image></url>
  <url><loc>https://utsav-countdown.vercel.app/durga-puja-countdown/</loc><lastmod>2026-09-01</lastmod><image:image><image:loc>https://utsav-countdown.vercel.app/durga-puja.jpg</image:loc></image:image></url>
  <url><loc>https://utsav-countdown.vercel.app/kali-puja-countdown/</loc><lastmod>2026-09-01</lastmod><image:image><image:loc>https://utsav-countdown.vercel.app/kali-puja.jpg</image:loc></image:image></url>
  <url><loc>https://utsav-countdown.vercel.app/mahalaya-countdown/</loc><lastmod>2026-09-01</lastmod><image:image><image:loc>https://utsav-countdown.vercel.app/mahalaya.jpg</image:loc></image:image></url>
</urlset>
'''
(ROOT/'sitemap.xml').write_text(sitemap,encoding='utf-8')

# robots: explicit crawl allowance and sitemap only.
(ROOT/'robots.txt').write_text('''User-agent: *\nAllow: /\n\nSitemap: https://utsav-countdown.vercel.app/sitemap.xml\n''',encoding='utf-8')

# Manifest: improve discoverability/app metadata without adding unsupported claims.
manifest={
 "name":"Utsav — Durga Puja, Kali Puja & Mahalaya Countdown 2026",
 "short_name":"Utsav",
 "description":"Live 2026 countdowns for Durga Puja, Kali Puja and Mahalaya.",
 "start_url":"/",
 "display":"standalone",
 "theme_color":"#111016",
 "background_color":"#111016",
 "lang":"en-IN"
}
(ROOT/'site.webmanifest').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

print('SEO update complete')
