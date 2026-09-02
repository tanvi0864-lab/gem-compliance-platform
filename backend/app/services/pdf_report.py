import io
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_compliance_pdf(verification_data: dict) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#0F172A'),
        alignment=0,
        spaceAfter=6
    )
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.HexColor('#64748B'),
        spaceAfter=15
    )
    heading_style = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontSize=13,
        leading=16,
        textColor=colors.HexColor('#1E293B'),
        spaceBefore=12,
        spaceAfter=6
    )
    body_style = ParagraphStyle(
        'BodyText',
        parent=styles['Normal'],
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#334155')
    )

    story = []

    # Header
    story.append(Paragraph("<b>GeM Bid Compliance AI</b>", title_style))
    story.append(Paragraph("AI-Powered Integrated Bid Compliance Verification Platform for GeM Procurement • SIH26100", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#2563EB'), spaceAfter=15))

    # Tender & Bidder Info Summary Table
    bidder = verification_data.get("bidder", {})
    tender = verification_data.get("tender", {})
    score = verification_data.get("compliance_score", 0.0)
    risk = verification_data.get("risk_level", "UNKNOWN")
    decision = verification_data.get("officer_decision", "PENDING")

    info_data = [
        [Paragraph("<b>Tender Title:</b>", body_style), Paragraph(f"{tender.get('title', 'N/A')}", body_style),
         Paragraph("<b>Compliance Score:</b>", body_style), Paragraph(f"<b>{score}/100</b>", body_style)],
        [Paragraph("<b>Tender ID:</b>", body_style), Paragraph(f"{tender.get('tender_id', 'N/A')}", body_style),
         Paragraph("<b>Risk Classification:</b>", body_style), Paragraph(f"<b>{risk}</b>", body_style)],
        [Paragraph("<b>Bidder Name:</b>", body_style), Paragraph(f"{bidder.get('company_name', 'N/A')}", body_style),
         Paragraph("<b>Officer Decision:</b>", body_style), Paragraph(f"<b>{decision}</b>", body_style)],
        [Paragraph("<b>GSTIN / PAN:</b>", body_style), Paragraph(f"{bidder.get('gstin', 'N/A')} / {bidder.get('pan', 'N/A')}", body_style),
         Paragraph("<b>Report Date:</b>", body_style), Paragraph("2026-09-02", body_style)]
    ]

    t_info = Table(info_data, colWidths=[100, 200, 110, 130])
    t_info.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_info)
    story.append(Spacer(1, 15))

    # AI Recommendation Section
    story.append(Paragraph("<b>AI Decision-Support Recommendation</b>", heading_style))
    rec_text = verification_data.get("ai_recommendation", "Manual review recommended.")
    story.append(Paragraph(f"<i>\"{rec_text}\"</i>", body_style))
    story.append(Spacer(1, 15))

    # Requirement Evaluation Table
    story.append(Paragraph("<b>Detailed Requirement Evaluation & Evidence Trail</b>", heading_style))
    
    table_data = [
        [Paragraph("<b>Requirement</b>", body_style),
         Paragraph("<b>Extracted / Declared</b>", body_style),
         Paragraph("<b>Expected / Rule</b>", body_style),
         Paragraph("<b>Status</b>", body_style),
         Paragraph("<b>Source & Page</b>", body_style)]
    ]

    for check in verification_data.get("checks", []):
        status_color = "#166534" if check.get("status") == "PASSED" else ("#991B1B" if check.get("status") == "FAILED" else "#9A3412")
        status_para = Paragraph(f"<font color='{status_color}'><b>{check.get('status')}</b></font>", body_style)
        
        table_data.append([
            Paragraph(f"<b>{check.get('title')}</b>", body_style),
            Paragraph(f"{check.get('extracted_value', 'N/A')}", body_style),
            Paragraph(f"{check.get('expected_value', 'N/A')}", body_style),
            status_para,
            Paragraph(f"{check.get('source_document', 'Doc')}<br/>Pg {check.get('page_number', 1)}", body_style)
        ])

    t_checks = Table(table_data, colWidths=[140, 110, 110, 80, 100])
    t_checks.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F1F5F9')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('PADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_checks)
    story.append(Spacer(1, 15))

    # Discrepancy Radar Section
    discrepancies = verification_data.get("discrepancies", [])
    if discrepancies:
        story.append(Paragraph("<b>Discrepancy & Risk Radar Flags</b>", heading_style))
        disc_table_data = [
            [Paragraph("<b>Severity</b>", body_style), Paragraph("<b>Title</b>", body_style), Paragraph("<b>Description</b>", body_style)]
        ]
        for d in discrepancies:
            sev_color = "#DC2626" if d.get("severity") == "CRITICAL" else "#D97706"
            sev_para = Paragraph(f"<font color='{sev_color}'><b>{d.get('severity')}</b></font>", body_style)
            disc_table_data.append([
                sev_para,
                Paragraph(f"<b>{d.get('title')}</b>", body_style),
                Paragraph(f"{d.get('description')}", body_style)
            ])
        t_disc = Table(disc_table_data, colWidths=[80, 160, 300])
        t_disc.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#FEF2F2')),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#FCA5A5')),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('PADDING', (0,0), (-1,-1), 4),
        ]))
        story.append(t_disc)

    # Footer Notice
    story.append(Spacer(1, 20))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#94A3B8'), spaceAfter=8))
    story.append(Paragraph("<b>AUDIT DISCLAIMER:</b> This verification report is generated by the GeM AI Compliance Support System. The Procurement Officer retains ultimate statutory authority for final tender qualification decisions.", ParagraphStyle('FooterStyle', parent=styles['Normal'], fontSize=8, textColor=colors.HexColor('#94A3B8'))))

    doc.build(story)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
