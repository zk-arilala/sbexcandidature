import { PDFDocument, RGB, rgb, StandardFonts } from 'pdf-lib';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { PiecesJointes } from '../../prisma/generated/client';

interface FieldPosition {
  x: number;
  y: number;
  fontSize?: number;
  maxWidth?: number;
  color?: RGB;
}

let fontSize_text = 12;
let color_text = rgb(0, 0, 0);

export class PDFExportTemplate {
  private dossier: any;
  private typeBourseId: number;
  private typeBourse: string;
  private pdfDoc: PDFDocument | null = null;
  private font: any = null;
  private boldFont: any = null;

  // Positions précises pour Universitaire - Page 1
  private universitairePage1: Record<string, FieldPosition> = {
    photoPosition: { x: 431, y: 695 },

    numeroDossier: { x: 100, y: 765, fontSize: fontSize_text, color: color_text },
    dateDepot: { x: 100, y: 739, fontSize: fontSize_text, color: color_text },
    regionOrigine: { x: 220, y: 644, fontSize: fontSize_text, color: color_text },
    nomPrenom: { x: 220, y: 548, fontSize: fontSize_text, color: color_text, maxWidth: 200 },
    
    sexeM: { x: 499, y: 540, fontSize: fontSize_text, color: color_text },
    sexeF: { x: 514, y: 540, fontSize: fontSize_text, color: color_text },

    dateNaissance: { x: 180, y: 520, fontSize: fontSize_text, color: color_text, maxWidth: 250 },
    lieuNaissance: { x: 312, y: 520, fontSize: fontSize_text, color: color_text, maxWidth: 250 },
    age: { x: 500, y: 520, fontSize: fontSize_text, color: color_text },
    nationalite: { x: 120, y: 495, fontSize: fontSize_text, color: color_text },
    
    situationFamiliale: { x: 400, y: 432, fontSize: fontSize_text, color: color_text },
    situationCelibataire: { x: 142, y: 460, fontSize: fontSize_text, color: color_text },
    situationMarie: { x: 200, y: 460, fontSize: fontSize_text, color: color_text },
    situationDivorce: { x: 256, y: 460, fontSize: fontSize_text, color: color_text },
    situationVeuf: { x: 315, y: 460, fontSize: fontSize_text, color: color_text },
    
    adresse: { x: 195, y: 440, fontSize: fontSize_text, color: color_text, maxWidth: 350 },
    email: { x: 195, y: 415, fontSize: fontSize_text, color: color_text },
    telephone: { x: 188, y: 387, fontSize: fontSize_text, color: color_text },
    pere: { x: 100, y: 360, fontSize: fontSize_text, color: color_text },
    pereProfession: { x: 410, y: 360, fontSize: fontSize_text, color: color_text },
    mere: { x: 100, y: 334, fontSize: fontSize_text, color: color_text },
    mereProfession: { x: 398, y: 334, fontSize: fontSize_text, color: color_text },
    tuteur: { x: 110, y: 308, fontSize: fontSize_text, color: color_text },
    tuteurProfession: { x: 400, y: 308, fontSize: fontSize_text, color: color_text },
    urgenceNom: { x: 316, y: 278, fontSize: fontSize_text, color: color_text },
    urgenceAdresse: { x: 230, y: 262, fontSize: fontSize_text, color: color_text, maxWidth: 300 },
    urgenceTel: { x: 440, y: 278, fontSize: fontSize_text, color: color_text },
    nombreFrereSoeur: { x: 250, y: 251, fontSize: fontSize_text, color: color_text },
    
    specialites: { x: 110, y: 136, fontSize: fontSize_text, color: color_text, maxWidth: 350 },
    paysDemandes: { x: 138, y: 110, fontSize: fontSize_text, color: color_text, maxWidth: 350 },
  };

  // Positions précises pour Universitaire - Page 2
  private universitairePage2: Record<string, FieldPosition> = {
    faitA: { x: 100, y: 560, fontSize: fontSize_text, color: color_text },
    dateSignature: { x: 250, y: 560, fontSize: fontSize_text, color: color_text },
  };

  // Positions précises pour Post-Universitaire - Page 1
  private postUniversitairePage1: Record<string, FieldPosition> = {
    photoPosition: { x: 432, y: 678 },

    numeroDossier: { x: 100, y: 747, fontSize: fontSize_text, color: color_text },
    dateDepot: { x: 100, y: 721, fontSize: fontSize_text, color: color_text },
    regionOrigine: { x: 220, y: 613, fontSize: fontSize_text, color: color_text },
    nomPrenom: { x: 220, y: 516, fontSize: fontSize_text, color: color_text, maxWidth: 200 },

    sexeM: { x: 499, y: 508, fontSize: fontSize_text, color: color_text },
    sexeF: { x: 514, y: 508, fontSize: fontSize_text, color: color_text },

    dateNaissance: { x: 180, y: 490, fontSize: fontSize_text, color: color_text, maxWidth: 250 },
    lieuNaissance: { x: 312, y: 489, fontSize: fontSize_text, color: color_text, maxWidth: 250 },
    age: { x: 500, y: 488, fontSize: fontSize_text, color: color_text },
    nationalite: { x: 120, y: 462, fontSize: fontSize_text, color: color_text },

    situationFamiliale: { x: 400, y: 432, fontSize: fontSize_text, color: color_text },
    situationCelibataire: { x: 143, y: 428, fontSize: fontSize_text, color: color_text },
    situationMarie: { x: 200, y: 428, fontSize: fontSize_text, color: color_text },
    situationDivorce: { x: 253, y: 428, fontSize: fontSize_text, color: color_text },
    situationVeuf: { x: 310, y: 428, fontSize: fontSize_text, color: color_text },
    
    employeurConjointNom: { x: 330, y: 408, fontSize: fontSize_text, color: color_text, maxWidth: 300 },
    employeurConjointAdresse: { x: 330, y: 396, fontSize: fontSize_text, color: color_text, maxWidth: 300 },
    
    adresse: { x: 200, y: 382, fontSize: fontSize_text, color: color_text, maxWidth: 350 },
    email: { x: 190, y: 356, fontSize: fontSize_text, color: color_text },
    telephone: { x: 170, y: 330, fontSize: fontSize_text, color: color_text },
    nombreEnfants: { x: 160, y: 302, fontSize: fontSize_text, color: color_text },
    enfantsACharge: { x: 340, y: 302, fontSize: fontSize_text, color: color_text },
    urgenceNom: { x: 318, y: 275, fontSize: fontSize_text, color: color_text },
    urgenceAdresse: { x: 230, y: 258, fontSize: fontSize_text, color: color_text, maxWidth: 300 },
    urgenceTel: { x: 440, y: 275, fontSize: fontSize_text, color: color_text },
    
    specialites: { x: 120, y: 192, fontSize: fontSize_text, color: color_text, maxWidth: 350 },
    paysDemandes: { x: 145, y: 162, fontSize: fontSize_text, color: color_text, maxWidth: 350 },
    organismeAccueil: { x: 270, y: 135, fontSize: fontSize_text, color: color_text, maxWidth: 350 },

    autreDemande: { x: 558, y: 78, fontSize: 11, color: color_text },
    natureBourse: { x: 60, y: 40, fontSize: fontSize_text, color: color_text, maxWidth: 200 },
    specialite: { x: 60, y: 25, fontSize: fontSize_text, color: color_text, maxWidth: 200 },
    organismeSollicite: { x: 300, y: 40, fontSize: fontSize_text, color: color_text, maxWidth: 200 },
    dateDepart: { x: 300, y: 25, fontSize: fontSize_text, color: color_text },
  };

  // Positions précises pour Post-Universitaire - Page 2
  /*private postUniversitairePage2: Record<string, FieldPosition> = {
    faitA: { x: 100, y: 560, fontSize: 11 },
    dateSignature: { x: 280, y: 560, fontSize: 11 },
  };*/

  constructor(dossier: any) {
    this.dossier = dossier;
    this.typeBourseId = dossier.type_bourse_id; // 1 = Universitaire, 2 = Post-Universitaire
    this.typeBourse = dossier.type_bourse?.libelle || 'Universitaire';
  }

  private formatDate(date: string | Date, formatStr: string = 'dd/MM/yyyy'): string {
    if (!date) return '';
    return format(new Date(date), formatStr, { locale: fr });
  }

  private formatSituationFamiliale(situation: string): string {
    const map: Record<string, string> = {
      celibataire: 'Célibataire',
      marie: 'Marié(e)',
      divorce: 'Divorcé(e)',
      veuf: 'Veuf(ve)'
    };
    return map[situation] || situation;
  }

  private async loadImageAsBytes(imagePath: string): Promise<Uint8Array> {
    try {
      const response = await fetch(imagePath);
      if (!response.ok) {
        throw new Error(`Erreur chargement image: ${response.status}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      return new Uint8Array(arrayBuffer);
    } catch (error) {
      console.error("Erreur chargement image:", error);
      throw error;
    }
  }

  private async addPageWithTemplate(imageBytes: Uint8Array) {
    if (!this.pdfDoc) return null;

    const page = this.pdfDoc.addPage([595.28, 841.89]); // A4
    
    let image;
    try {
      image = await this.pdfDoc.embedJpg(imageBytes);
    } catch {
      try {
        image = await this.pdfDoc.embedPng(imageBytes);
      } catch (error) {
        console.error("Format d'image non supporté", error);
        return null;
      }
    }

    page.drawImage(image, {
      x: 0,
      y: 0,
      width: 595.28,
      height: 841.89,
    });

    return page;
  }

  private drawText(page: any, text: string, field: FieldPosition) {
    if (!text || !field || !this.font) return;

    const fontSize = field.fontSize || 10;
    
    if (field.maxWidth) {
      const words = text.split(' ');
      let line = '';
      let yOffset = 0;
      
      for (const word of words) {
        const testLine = line + (line ? ' ' : '') + word;
        const width = this.font.widthOfTextAtSize(testLine, fontSize);
        
        if (width > field.maxWidth && line) {
          page.drawText(line, {
            x: field.x,
            y: field.y - yOffset,
            size: fontSize,
            font: this.font,
            color: rgb(0, 0, 0),
          });
          line = word;
          yOffset += fontSize + 2;
        } else {
          line = testLine;
        }
      }
      
      if (line) {
        page.drawText(line, {
          x: field.x,
          y: field.y - yOffset,
          size: fontSize,
          font: this.font,
          color: rgb(0, 0, 0),
        });
      }
    } else {
      page.drawText(text, {
        x: field.x,
        y: field.y,
        size: fontSize,
        font: this.font,
        color: rgb(0, 0, 0),
      });
    }
  }

  public async generate(): Promise<Blob> {
    try {
      this.pdfDoc = await PDFDocument.create();
      this.font = await this.pdfDoc.embedFont(StandardFonts.Helvetica);
      this.boldFont = await this.pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const isUniversitaire = this.typeBourseId === 1;
      const typeLabel = isUniversitaire ? 'UNIVERSITAIRE' : 'POST-UNIVERSITAIRE';

      const c = this.dossier.candidat || {};

      if (isUniversitaire) {
        // ========== PAGE 1 UNIVERSITAIRE ==========
        const page1Image = await this.loadImageAsBytes('/templates/universitaire/Formulaire_BU_1.png');
        const page1 = await this.addPageWithTemplate(page1Image);
        
        if (page1) {
          const photoIdentite: PiecesJointes = this.dossier.pieces_jointes?.find(
            (piece: { type_piece: string;  }) => piece.type_piece === "Photo d'identité récente"
          );
          if (photoIdentite) {
            const filePath = `/pieces_jointes/${this.dossier.numero_dossier}/${photoIdentite.nom_fichier}`;
            const response = await fetch(filePath);
            const photoBytes = await response.arrayBuffer();

            const photoPos = this.universitairePage1.photoPosition;

            const fileName = photoIdentite.nom_fichier.toLowerCase();
            let photoImage;
            if (fileName.endsWith('.png')) {
              photoImage = await page1.doc.embedPng(photoBytes);
            } else if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
              photoImage = await page1.doc.embedJpg(photoBytes);
            }

            if (photoImage) {
              page1.drawImage(photoImage, {
                x: photoPos.x,
                y: photoPos.y,
                width: 108,
                height: 102,
              });
            } else {
              page1.drawRectangle({
                x: photoPos.x,
                y: photoPos.y,
                width: 108,
                height: 102,
                borderColor: rgb(0, 0, 0),
                borderWidth: 0,
                color: undefined
              });
            }
          }

          this.drawText(page1, this.dossier.numero_dossier || '', this.universitairePage1.numeroDossier);
          this.drawText(page1, this.formatDate(this.dossier.date_depot), this.universitairePage1.dateDepot);
          this.drawText(page1, c.region.libelle || '', this.universitairePage1.regionOrigine);
          this.drawText(page1, `${c.nom || ''} ${c.prenom || ''}`.trim(), this.universitairePage1.nomPrenom);
          //this.drawText(page1, c.sexe === 'M' ? 'M' : 'F', this.universitairePage1.sexe);
          const sexePos = c.sexe === 'M' 
            ? this.universitairePage1.sexeM 
            : this.universitairePage1.sexeF;
          page1.drawRectangle({
            x: sexePos.x,
            y: sexePos.y,
            width: 14,
            height: 14,
            borderColor: rgb(0, 0, 0),
            borderWidth: 2,
            color: undefined
          });
          
          this.drawText(page1, this.formatDate(c.date_naissance), this.universitairePage1.dateNaissance);
          this.drawText(page1, c.lieu_naissance, this.universitairePage1.lieuNaissance);
          
          this.drawText(page1, c.age?.toString() || '', this.universitairePage1.age);
          this.drawText(page1, c.nationalite || '', this.universitairePage1.nationalite);
          //this.drawText(page1, this.formatSituationFamiliale(c.situation_familiale), this.universitairePage1.situationFamiliale);
          let situationPos;
          switch (c.situation_familiale) {
            case 'celibataire':
              situationPos = this.universitairePage1.situationCelibataire;
              break;
            case 'marie':
              situationPos = this.universitairePage1.situationMarie;
              break;
            case 'divorce':
              situationPos = this.universitairePage1.situationDivorce;
              break;
            case 'veuf':
              situationPos = this.universitairePage1.situationVeuf;
              break;
            default:
              situationPos = null;
          }
          if (situationPos) {
            page1.drawRectangle({
              x: situationPos.x,
              y: situationPos.y,
              width: 55,
              height: 16,
              borderColor: rgb(0, 0, 0),
              borderWidth: 2,
              color: undefined
            });
          }

          this.drawText(page1, c.logement_adresse || '', this.universitairePage1.adresse);
          this.drawText(page1, c.email || '', this.universitairePage1.email);
          this.drawText(page1, c.telephone || '', this.universitairePage1.telephone);
          this.drawText(page1, c.pere_nom || '', this.universitairePage1.pere);
          this.drawText(page1, c.pere_profession || '', this.universitairePage1.pereProfession);
          this.drawText(page1, c.mere_nom || '', this.universitairePage1.mere);
          this.drawText(page1, c.mere_profession || '', this.universitairePage1.mereProfession);
          this.drawText(page1, c.tuteur_nom || 'sqdsqds', this.universitairePage1.tuteur);
          this.drawText(page1, c.tuteur_profession || 'sqsdqsd', this.universitairePage1.tuteurProfession);
          this.drawText(page1, c.urgence_nom || '', this.universitairePage1.urgenceNom);
          this.drawText(page1, "Adresse : " + c.urgence_adresse || '', this.universitairePage1.urgenceAdresse);
          this.drawText(page1, c.urgence_telephone || '', this.universitairePage1.urgenceTel);
          this.drawText(page1, c.nombre_frere_soeur?.toString() || '', this.universitairePage1.nombreFrereSoeur);
          this.drawText(page1, this.dossier.specialites || '', this.universitairePage1.specialites);
          this.drawText(page1, this.dossier.pays_demandes || '', this.universitairePage1.paysDemandes);
        }

        // ========== PAGE 2 UNIVERSITAIRE ==========
        const page2Image = await this.loadImageAsBytes('/templates/universitaire/Formulaire_BU_2.png');
        const page2 = await this.addPageWithTemplate(page2Image);
        
        /*if (page2) {
          this.drawText(page2, 'Antananarivo', this.universitairePage2.faitA);
          this.drawText(page2, this.formatDate(new Date()), this.universitairePage2.dateSignature);
        }*/

      } else {
        // ========== PAGE 1 POST-UNIVERSITAIRE ==========
        const page1Image = await this.loadImageAsBytes('/templates/post-universitaire/Formulaire_BPU_1.png');
        const page1 = await this.addPageWithTemplate(page1Image);
        
        if (page1) {
          const photoIdentite: PiecesJointes = this.dossier.pieces_jointes?.find(
            (piece: { type_piece: string;  }) => piece.type_piece === "Photo d'identité récente"
          );
          if (photoIdentite) {
            const filePath = `/pieces_jointes/${this.dossier.numero_dossier}/${photoIdentite.nom_fichier}`;
            const response = await fetch(filePath);
            const photoBytes = await response.arrayBuffer();

            const photoPos = this.postUniversitairePage1.photoPosition;

            const fileName = photoIdentite.nom_fichier.toLowerCase();
            let photoImage;
            if (fileName.endsWith('.png')) {
              photoImage = await page1.doc.embedPng(photoBytes);
            } else if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
              photoImage = await page1.doc.embedJpg(photoBytes);
            }

            if (photoImage) {
              page1.drawImage(photoImage, {
                x: photoPos.x,
                y: photoPos.y,
                width: 108,
                height: 102,
              });
            } else {
              page1.drawRectangle({
                x: photoPos.x,
                y: photoPos.y,
                width: 108,
                height: 102,
                borderColor: rgb(0, 0, 0),
                borderWidth: 0,
                color: undefined
              });
            }
          }

          this.drawText(page1, this.dossier.numero_dossier || '', this.postUniversitairePage1.numeroDossier);
          this.drawText(page1, this.formatDate(this.dossier.date_depot), this.postUniversitairePage1.dateDepot);
          this.drawText(page1, c.region.libelle || '', this.postUniversitairePage1.regionOrigine);
          this.drawText(page1, `${c.nom || ''} ${c.prenom || ''}`.trim(), this.postUniversitairePage1.nomPrenom);
          //this.drawText(page1, c.sexe === 'M' ? 'M' : 'F', this.postUniversitairePage1.sexe);
          const sexePos = c.sexe === 'M' 
            ? this.postUniversitairePage1.sexeM 
            : this.postUniversitairePage1.sexeF;
          page1.drawRectangle({
            x: sexePos.x,
            y: sexePos.y,
            width: 14,
            height: 14,
            borderColor: rgb(0, 0, 0),
            borderWidth: 2,
            color: undefined
          });
          
          this.drawText(page1, this.formatDate(c.date_naissance), this.postUniversitairePage1.dateNaissance);
          this.drawText(page1, c.lieu_naissance, this.postUniversitairePage1.lieuNaissance);
          
          this.drawText(page1, c.age?.toString() || '', this.postUniversitairePage1.age);
          this.drawText(page1, c.nationalite || '', this.postUniversitairePage1.nationalite);
          //this.drawText(page1, this.formatSituationFamiliale(c.situation_familiale), this.postUniversitairePage1.situationFamiliale);
          let situationPos;
          switch (c.situation_familiale) {
            case 'celibataire':
              situationPos = this.postUniversitairePage1.situationCelibataire;
              break;
            case 'marie':
              situationPos = this.postUniversitairePage1.situationMarie;
              break;
            case 'divorce':
              situationPos = this.postUniversitairePage1.situationDivorce;
              break;
            case 'veuf':
              situationPos = this.postUniversitairePage1.situationVeuf;
              break;
            default:
              situationPos = null;
          }
          if (situationPos) {
            page1.drawRectangle({
              x: situationPos.x,
              y: situationPos.y,
              width: 55,
              height: 16,
              borderColor: rgb(0, 0, 0),
              borderWidth: 2,
              color: undefined
            });
          }

          this.drawText(page1, c.conjoint_employeur_nom || '', this.postUniversitairePage1.employeurConjointNom);
          this.drawText(page1, c.conjoint_employeur_adresse || '', this.postUniversitairePage1.employeurConjointAdresse);
          this.drawText(page1, c.logement_adresse || '', this.postUniversitairePage1.adresse);
          this.drawText(page1, c.email || '', this.postUniversitairePage1.email);
          this.drawText(page1, c.telephone || '', this.postUniversitairePage1.telephone);
          this.drawText(page1, c.nombre_enfants?.toString() || '', this.postUniversitairePage1.nombreEnfants);
          this.drawText(page1, c.nombre_enfants_acharge?.toString() || '', this.postUniversitairePage1.enfantsACharge);
          this.drawText(page1, c.urgence_nom || '', this.postUniversitairePage1.urgenceNom);
          this.drawText(page1, "Adresse : " + c.urgence_adresse || '', this.postUniversitairePage1.urgenceAdresse);
          this.drawText(page1, c.urgence_telephone || '', this.postUniversitairePage1.urgenceTel);
          this.drawText(page1, this.dossier.specialites || '', this.postUniversitairePage1.specialites);
          this.drawText(page1, this.dossier.pays_demandes || '', this.postUniversitairePage1.paysDemandes);
          this.drawText(page1, this.dossier.organisme_sollicite || '', this.postUniversitairePage1.organismeAccueil);
          
          // Autres dépôts
          this.drawText(page1, this.dossier.autre_depot_externe === true ? 'OUI' : 'NON', this.postUniversitairePage1.autreDemande);
          if (this.dossier.autre_depot_externe && this.dossier.depots_externes?.length > 0) {
            const depot = this.dossier.depots_externes[0];
            this.drawText(page1, "Nature : " + depot.nature_bourse || '', this.postUniversitairePage1.natureBourse);
            this.drawText(page1, "Specialité : " + depot.specialite || '', this.postUniversitairePage1.specialite);
            this.drawText(page1, "Organisme : " + depot.organisme_sollicite || '', this.postUniversitairePage1.organismeSollicite);
            this.drawText(page1, depot.date_depart ? "Date du départ : " + this.formatDate(depot.date_depart) : '', this.postUniversitairePage1.dateDepart);
          }
        }

        // ========== PAGE 2 POST-UNIVERSITAIRE ==========
        const page2Image = await this.loadImageAsBytes('/templates/post-universitaire/Formulaire_BPU_2.png');
        const page2 = await this.addPageWithTemplate(page2Image);
        
        /*if (page2) {
          this.drawText(page2, 'Antananarivo', this.postUniversitairePage2.faitA);
          this.drawText(page2, this.formatDate(new Date()), this.postUniversitairePage2.dateSignature);
        }*/
      }

      const pdfBytes = await this.pdfDoc.save();
      return new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });

    } catch (error) {
      console.error('Erreur génération PDF:', error);
      throw error;
    }
  }
}