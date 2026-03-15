// hooks/useExportPDF.ts
import { useState } from 'react';
import { PDFExportTemplate } from '@/services/pdfExportTemplate';

export function useExportPDF() {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportToPDF = async (dossier: any) => {
    setIsExporting(true);
    setError(null);

    try {
      // Vérification du type de bourse
      if (!dossier.type_bourse_id) {
        throw new Error('Type de bourse non spécifié');
      }

      console.log('Export PDF pour dossier:', {
        numero: dossier.numero_dossier,
        typeBourseId: dossier.type_bourse_id,
        type: dossier.type_bourse_id === 1 ? 'Universitaire' : 'Post-Universitaire'
      });
      
      const pdfService = new PDFExportTemplate(dossier);
      const pdfBlob = await pdfService.generate();
      
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;

      //date
      const dateDepotDossier = new Date(dossier.date_depot);
      const day = String(dateDepotDossier.getDate()).padStart(2, '0');
      const month = String(dateDepotDossier.getMonth() + 1).padStart(2, '0');
      const year = dateDepotDossier.getFullYear();
      //heure
      const hours = String(dateDepotDossier.getHours()).padStart(2, '0');
      const minutes = String(dateDepotDossier.getMinutes()).padStart(2, '0');
      const seconds = String(dateDepotDossier.getSeconds()).padStart(2, '0');
      //date et heure : String
      const dateStr = `${day}${month}${year}`;
      const timeStr = `${hours}${minutes}${seconds}`;
      
      const typeLabel = dossier.type_bourse_id === 1 ? 'universitaire' : 'post-universitaire';
      link.download = `dossier_${dossier.numero_dossier}_depot_${dateStr}_${timeStr}.pdf`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (err) {
      console.error('Erreur export PDF:', err);
      setError("Erreur lors de la génération du PDF");
    } finally {
      setIsExporting(false);
    }
  };

  return { exportToPDF, isExporting, error };
}