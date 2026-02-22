import type { CvData } from '../types/cv';
import { DEFAULT_SECTION_TITLES, DEFAULT_COLOR_SCHEME } from '../utils/defaultData';
import { formatDate, formatDateRange } from '../utils/dateFormat';
import cvCss from './cv-template.css?raw';

function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Build CSS variable overrides for color scheme
function buildColorVars(data: CvData): string {
  const cs = data.colorScheme || DEFAULT_COLOR_SCHEME;
  return `:root {
  --cv-header-bg: ${cs.headerBg};
  --cv-header-text: ${cs.headerText};
  --cv-sidebar-bg: ${cs.sidebarBg};
  --cv-accent: ${cs.accentColor};
  --cv-text: ${cs.textColor};
  --cv-border: ${cs.borderColor};
}`;
}

// Resolve section title with fallback
function title(data: CvData, key: keyof typeof DEFAULT_SECTION_TITLES): string {
  return esc(data.sectionTitles?.[key] || DEFAULT_SECTION_TITLES[key]);
}

// Resolve job date using structured fields or raw fallback
function jobDate(data: CvData, j: CvData['workExperience'][number]): string {
  const fmt = data.dateFormat || 'raw';
  const rangeStr = formatDateRange(
    fmt,
    { month: j.startMonth, year: j.startYear },
    { month: j.endMonth, year: j.endYear },
    j.isCurrent,
    j.date,
  );
  return esc(rangeStr || j.date);
}

// Resolve education date
function eduDate(data: CvData, e: CvData['education'][number]): string {
  const fmt = data.dateFormat || 'raw';
  const formatted = formatDate(fmt, e.graduationMonth, e.graduationYear, e.date);
  return esc(formatted || e.date);
}

export function generateCvHtml(data: CvData): string {
  const contactHtml = data.contactItems
    .map((c) => `<div class="contact-item"><i class="${esc(c.icon)}"></i> ${esc(c.text)}</div>`)
    .join('\n\t\t\t\t\t');

  const educationHtml = data.education
    .map((e) => `
				<div class="education-item">
					<div class="education-title">${esc(e.title)}</div>
					<div class="education-school">${esc(e.school)}</div>
					<div class="date">${eduDate(data, e)}</div>
				</div>`)
    .join('');

  const techSkillsHtml = data.technicalSkills
    .map((s) => `<div class="skill-item">${esc(s)}</div>`)
    .join('\n\t\t\t\t\t\t');

  const personalSkillsHtml = data.personalSkills
    .map((s) => `<div class="skill-item">${esc(s)}</div>`)
    .join('\n\t\t\t\t\t\t');

  const interestsHtml = data.interests
    .map((i) => `<div class="interest-item">${esc(i)}</div>`)
    .join('\n\t\t\t\t\t\t');

  const jobsHtml = data.workExperience
    .map((j) => `
					<div class="job">
						<div class="job-header">
							<div class="job-title">${esc(j.title)}</div>
							<div class="company">${esc(j.company)}</div>
							<div class="date">${jobDate(data, j)}</div>
						</div>
						<ul>
							${j.achievements.map((a) => `<li>${esc(a)}</li>`).join('\n\t\t\t\t\t\t\t')}
						</ul>
					</div>`)
    .join('');

  const projectsHtml = data.projects
    .map((p) => `
					<div class="project">
						<div class="project-title">${esc(p.title)}</div>
						<ul>
							${p.details.map((d) => `<li>${esc(d)}</li>`).join('\n\t\t\t\t\t\t\t')}
						</ul>
					</div>`)
    .join('');

  const certsHtml = data.certifications
    .map((cat) => `
					<div class="cert-category">
						<h4>${esc(cat.title)}</h4>
						${cat.items.map((ci) => `<div class="cert-item">
							${esc(ci.name)}
							<span class="cert-year">${esc(ci.year)}</span>
						</div>`).join('\n\t\t\t\t\t\t')}
					</div>`)
    .join('');

  const size = data.photoSize || 160;
  const topOffset = Math.round(size * 0.94);

  const photoHtml = data.photoUrl
    ? `<div class="image-wrapper">
					<div class="image">
						<img src="${esc(data.photoUrl)}" alt="${esc(data.fullName)}" style="width: ${size}px; top: -${topOffset}px">
					</div>
				</div>`
    : '';

  const colorVars = buildColorVars(data);

  return `<!DOCTYPE html>
<html lang="es">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
	<title>CV - ${esc(data.fullName)}</title>
	<style>${colorVars}\n${cvCss}</style>
</head>
<body>
	<div class="container">
		<header class="header">
			<div class="header-content">
				<h1>${esc(data.fullName)}</h1>
				<div class="title">${esc(data.professionalTitle)}</div>
				${photoHtml}
				<div class="contact-info">
					${contactHtml}
				</div>
			</div>
		</header>

		<div class="main-content">
			<aside class="sidebar">
				<section class="section">
					<h2 class="section-title">${title(data, 'education')}</h2>
					${educationHtml}
				</section>

				<section class="section">
					<h2 class="section-title">${title(data, 'technicalSkills')}</h2>
					<div class="skills-grid">
						${techSkillsHtml}
					</div>
				</section>

				<section class="section">
					<h2 class="section-title">${title(data, 'personalSkills')}</h2>
					<div class="skills-grid">
						${personalSkillsHtml}
					</div>
				</section>

				<section class="section">
					<h2 class="section-title">${title(data, 'interests')}</h2>
					<div class="interests-list">
						${interestsHtml}
					</div>
				</section>
			</aside>

			<main class="content">
				<section class="section">
					<h2 class="section-title">${title(data, 'summary')}</h2>
					<p class="summary">${esc(data.summary)}</p>
				</section>

				<section class="section">
					<h2 class="section-title">${title(data, 'workExperience')}</h2>
					${jobsHtml}
				</section>

				<section class="section">
					<h2 class="section-title">${title(data, 'projects')}</h2>
					${projectsHtml}
				</section>

				<section class="section">
					<h2 class="section-title">${title(data, 'certifications')}</h2>
					${certsHtml}
				</section>
			</main>
		</div>
	</div>
</body>
</html>`;
}
