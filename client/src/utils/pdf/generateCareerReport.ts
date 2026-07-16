import { jsPDF } from "jspdf";

export type CareerReportData = {
  userProfile?: {
    name?: string;
    email?: string;
  };
  assessmentSummary?: {
    completedAt?: string;
    topCareerTitle?: string;
    topCareerScore?: number;
  };
  recommendations?: Array<{
    title: string;
    score: number;
    salaryIndiaMin?: number;
    salaryIndiaMax?: number;
    growthRate?: number;
    futureDemand?: number;
    automationRisk?: number;
    requiredSkills?: string[];
  }>;
  selectedCareer?: {
    title: string;
    slug: string;
    description?: string | null;
    salaryIndiaMin?: number | null;
    salaryIndiaMax?: number | null;
    growthRate?: number | null;
    futureDemand?: number | null;
    automationRisk?: number | null;
    requiredSkills?: string[];
    dailyWork?: string | null;
  };
  skillGapSummary?: {
    matchPercent?: number;
    strengths?: string[];
    missingSkills?: string[];
  };
  learningRoadmap?: Array<{
    skill: string;
    level?: string;
    resources?: string[];
  }>;
  aiMentorAdvice?: string;
};

const COLORS = {
  primary: [37, 99, 235] as [number, number, number],
  secondary: [124, 58, 237] as [number, number],
  accent: [16, 185, 129] as [number, number],
  text: [30, 41, 59] as [number, number],
  muted: [100, 116, 139] as [number, number],
  border: [226, 232, 240] as [number, number],
  bg: [248, 250, 252] as [number, number],
};

function addFooter(doc: jsPDF) {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.muted);
    doc.text(
      `Generated on ${new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}`,
      14,
      285
    );
    doc.text(`Page ${i} of ${pageCount}`, 180, 285, { align: "right" });
  }
}

function addSectionHeading(doc: jsPDF, title: string, y: number): number {
  doc.setFontSize(16);
  doc.setTextColor(...COLORS.primary);
  doc.text(title, 14, y);
  doc.setDrawColor(...COLORS.primary);
  doc.setLineWidth(0.5);
  doc.line(14, y + 2, 196, y + 2);
  return y + 12;
}

function addBodyText(doc: jsPDF, text: string, y: number, maxWidth = 180): number {
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.text);
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, 14, y);
  return y + lines.length * 5 + 4;
}

function addTable(
  doc: jsPDF,
  headers: string[],
  rows: string[][],
  startY: number,
  colWidths: number[]
): number {
  let y = startY;
  const rowHeight = 7;
  const xStart = 14;

  // Header row
  doc.setFillColor(...COLORS.primary);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  let x = xStart;
  headers.forEach((h, i) => {
    doc.rect(x, y, colWidths[i], rowHeight, "F");
    doc.text(h, x + 1, y + 5);
    x += colWidths[i];
  });
  y += rowHeight;

  // Data rows
  doc.setFont("helvetica", "normal");
  rows.forEach((row, ri) => {
    if (ri % 2 === 0) {
      doc.setFillColor(...COLORS.bg);
    } else {
      doc.setFillColor(255, 255, 255);
    }
    x = xStart;
    row.forEach((cell, ci) => {
      doc.rect(x, y, colWidths[ci], rowHeight, "F");
      doc.setTextColor(...COLORS.text);
      doc.setFontSize(8);
      doc.text(cell, x + 1, y + 5);
      x += colWidths[ci];
    });
    y += rowHeight;
  });

  return y + 6;
}

export function generateCareerReport(data: CareerReportData): jsPDF {
  const doc = new jsPDF("p", "mm", "a4");
  let y = 20;

  // Title
  doc.setFontSize(24);
  doc.setTextColor(...COLORS.primary);
  doc.setFont("helvetica", "bold");
  doc.text("Career Guidance Report", 14, y);
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(...COLORS.muted);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Generated: ${new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })}`,
    14,
    y
  );
  y += 14;

  // 1. User Profile
  if (data.userProfile) {
    y = addSectionHeading(doc, "1. User Profile", y);
    const profileLines: string[] = [];
    if (data.userProfile.name) profileLines.push(`Name: ${data.userProfile.name}`);
    if (data.userProfile.email) profileLines.push(`Email: ${data.userProfile.email}`);
    if (profileLines.length > 0) {
      y = addBodyText(doc, profileLines.join("\n"), y);
    } else {
      y = addBodyText(doc, "Profile information not available.", y);
    }
  }

  // 2. Assessment Summary
  if (data.assessmentSummary) {
    if (y > 250) { doc.addPage(); y = 20; }
    y = addSectionHeading(doc, "2. Assessment Summary", y);
    const lines: string[] = [];
    if (data.assessmentSummary.completedAt) {
      lines.push(`Completed: ${new Date(data.assessmentSummary.completedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`);
    }
    if (data.assessmentSummary.topCareerTitle) {
      lines.push(`Top Recommended Career: ${data.assessmentSummary.topCareerTitle}`);
    }
    if (data.assessmentSummary.topCareerScore !== undefined) {
      lines.push(`Match Score: ${Math.round(data.assessmentSummary.topCareerScore)}%`);
    }
    if (lines.length > 0) {
      y = addBodyText(doc, lines.join("\n"), y);
    } else {
      y = addBodyText(doc, "No assessment data available.", y);
    }
  }

  // 3. Top 5 Recommendations
  if (data.recommendations && data.recommendations.length > 0) {
    if (y > 230) { doc.addPage(); y = 20; }
    y = addSectionHeading(doc, "3. Top Recommendations", y);
    const headers = ["#", "Career", "Score", "Salary (India)", "Growth"];
    const colWidths = [8, 60, 20, 50, 42];
    const rows = data.recommendations.slice(0, 5).map((r, i) => [
      String(i + 1),
      r.title,
      `${Math.round(r.score)}%`,
      r.salaryIndiaMin && r.salaryIndiaMax
        ? `₹${(r.salaryIndiaMin / 100000).toFixed(1)}L-${(r.salaryIndiaMax / 100000).toFixed(1)}L`
        : "—",
      r.growthRate ? `${r.growthRate}%` : "—",
    ]);
    y = addTable(doc, headers, rows, y, colWidths);
  }

  // 4. Selected Career
  if (data.selectedCareer) {
    if (y > 220) { doc.addPage(); y = 20; }
    y = addSectionHeading(doc, "4. Selected Career", y);
    const c = data.selectedCareer;
    const lines: string[] = [`Career: ${c.title}`];
    if (c.description) lines.push(`Description: ${c.description}`);
    if (c.salaryIndiaMin && c.salaryIndiaMax) {
      lines.push(`Salary (India): ₹${(c.salaryIndiaMin / 100000).toFixed(1)}L - ₹${(c.salaryIndiaMax / 100000).toFixed(1)}L`);
    }
    if (c.growthRate !== null && c.growthRate !== undefined) lines.push(`Growth Rate: ${c.growthRate}%`);
    if (c.futureDemand !== null && c.futureDemand !== undefined) lines.push(`Future Demand: ${c.futureDemand}/10`);
    if (c.automationRisk !== null && c.automationRisk !== undefined) lines.push(`Automation Risk: ${c.automationRisk}/10`);
    if (c.dailyWork) lines.push(`Daily Work: ${c.dailyWork}`);
    if (c.requiredSkills && c.requiredSkills.length > 0) {
      lines.push(`Required Skills: ${c.requiredSkills.join(", ")}`);
    }
    y = addBodyText(doc, lines.join("\n"), y);
  }

  // 5. Skill Gap Summary
  if (data.skillGapSummary) {
    if (y > 230) { doc.addPage(); y = 20; }
    y = addSectionHeading(doc, "5. Skill Gap Summary", y);
    const s = data.skillGapSummary;
    const lines: string[] = [];
    if (s.matchPercent !== undefined) lines.push(`Overall Match: ${s.matchPercent}%`);
    if (s.strengths && s.strengths.length > 0) lines.push(`Strengths: ${s.strengths.join(", ")}`);
    if (s.missingSkills && s.missingSkills.length > 0) lines.push(`Skills to Develop: ${s.missingSkills.join(", ")}`);
    if (lines.length > 0) {
      y = addBodyText(doc, lines.join("\n"), y);
    } else {
      y = addBodyText(doc, "Skill gap data not available.", y);
    }
  }

  // 6. Learning Roadmap
  if (data.learningRoadmap && data.learningRoadmap.length > 0) {
    if (y > 230) { doc.addPage(); y = 20; }
    y = addSectionHeading(doc, "6. Learning Roadmap", y);
    const headers = ["Skill", "Priority", "Resources"];
    const colWidths = [50, 30, 100];
    const rows = data.learningRoadmap.map((r) => [
      r.skill,
      r.level || "Medium",
      r.resources?.join("; ") || "—",
    ]);
    y = addTable(doc, headers, rows, y, colWidths);
  }

  // 7. AI Mentor Advice
  if (data.aiMentorAdvice) {
    if (y > 240) { doc.addPage(); y = 20; }
    y = addSectionHeading(doc, "7. AI Mentor Advice", y);
    y = addBodyText(doc, data.aiMentorAdvice, y);
  }

  // Footer on all pages
  addFooter(doc);

  return doc;
}