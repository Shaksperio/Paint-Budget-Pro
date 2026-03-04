import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { BudgetData } from '../types/budget';

export function exportBudgetPdf(budget: BudgetData, total: number) {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(`Paint Budget Pro - Orçamento ${budget.numero}`, 14, 14);
  doc.setFontSize(11);
  doc.text(`Cliente: ${budget.client.nome}`, 14, 24);
  doc.text(`Endereço: ${budget.client.endereco}`, 14, 31);

  autoTable(doc, {
    startY: 38,
    head: [['Descrição', 'Área (m²)', 'Demãos', 'Preço/m²', 'Subtotal']],
    body: budget.itens.map((item) => [
      item.descricao,
      item.areaM2.toFixed(2),
      String(item.demaos),
      item.precoM2.toFixed(2),
      (item.areaM2 * item.demaos * item.precoM2).toFixed(2)
    ])
  });

  doc.text(`Total final: R$ ${total.toFixed(2)}`, 14, (doc as any).lastAutoTable.finalY + 12);
  doc.save(`orcamento-${budget.numero}.pdf`);
}
