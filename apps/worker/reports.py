from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
import os
import uuid

class ReportService:
    @staticmethod
    def generate_pdf(search_id: str, address: str, intel_data: dict, bureau_data: dict) -> str:
        # Create 'reports' directory if not exists
        reports_dir = os.path.join(os.getcwd(), "reports")
        os.makedirs(reports_dir, exist_ok=True)
        
        filename = f"imovel_{search_id}.pdf"
        filepath = os.path.join(reports_dir, filename)
        
        doc = SimpleDocTemplate(filepath, pagesize=letter)
        styles = getSampleStyleSheet()
        story = []
        
        # Title
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            spaceAfter=30,
            textColor=colors.HexColor('#0f172a')
        )
        story.append(Paragraph("Relatório de Inteligência Imobiliária", title_style))
        story.append(Paragraph(f"Imóvel: {address}", styles["Heading2"]))
        story.append(Spacer(1, 12))
        
        # Health Score Section
        score = intel_data.get('score', 0)
        classification = intel_data.get('classification', 'N/A')
        
        story.append(Paragraph("Análise de Saúde (Health Score)", styles["Heading2"]))
        story.append(Paragraph(f"Score: {score}/100 ({classification})", styles["Normal"]))
        
        if intel_data.get('penalties'):
            story.append(Spacer(1, 12))
            story.append(Paragraph("Pontos de Atenção:", styles["Heading3"]))
            for p in intel_data.get('penalties', []):
                story.append(Paragraph(f"• {p}", styles["Normal"]))
        
        story.append(Spacer(1, 24))
        
        # Owner Data Table
        story.append(Paragraph("Dados do Proprietário", styles["Heading2"]))
        owner_data = bureau_data.get('owner', {})
        data = [
            ["Campo", "Valor"],
            ["Nome", owner_data.get('name', 'N/A')],
            ["CPF (Mascarado)", owner_data.get('cpf_masked', 'N/A')],
            ["Status CPF", owner_data.get('status', 'N/A')],
            ["Inscrição Mun.", bureau_data.get('inscricao_municipal', 'N/A')]
        ]
        
        t = Table(data, colWidths=[150, 300])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#e2e8f0')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f8fafc')),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#cbd5e1'))
        ]))
        story.append(t)
        
        story.append(Spacer(1, 30))
        story.append(Paragraph("Gerado automaticamente por ImovelIntel SaaS", styles["Italic"]))
        
        doc.build(story)
        return filename  # Return relative path/filename
