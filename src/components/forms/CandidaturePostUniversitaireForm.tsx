"use client"

import React, { useState, ChangeEvent, useRef, useEffect, ReactNode } from "react"
import { creerCandidaturePostUniversitaire } from "@app/(site)/candidature-post-universitaire/actions"
import { Send, RotateCcw, Paperclip, FilePlus, X, Copy, CheckCheck, ArrowLeft, ArrowRight, Check, ShieldCheck, LockKeyhole, KeyIcon, UserLock, UserLockIcon, EyeOff, Eye, LogIn, TriangleAlert } from "lucide-react"
import { uploadFile, uploadMultipleFiles, generateCandidateFolder } from '@app/actions/upload'
import { getNextNumeroDossier } from "@app/(site)/candidature-post-universitaire/getNextNumeroDossier"
import AlertModal from "../ui/AlertModal"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useSession } from "@/context/SessionContext"

type Props = {
  regions: { id: number; libelle: string }[]
  provinces: { id: number; libelle: string }[]
  typesBourse: { id: number; libelle: string }[]
  diplomes: { id: number; libelle: string }[]
  defaultPaysDemande?: { id: number; pays: string } | null
};

type User = { 
  id: string | number; 
  email: string; 
};

const nationalites = ["Malagasy", "Afghane", "Algérien(ne)", "Allemand(e)", "Américain(e)", "Angolais(e)", "Argentin(e)", "Australien(ne)", "Belge", "Béninois(e)", "Brésilien(ne)", "Britannique", "Camerounais(e)", "Canadien(ne)", "Chinois(e)", "Colombien(ne)", "Comorien(ne)", "Congolais(e)", "Coréen(ne)", "Djiboutien(ne)", "Égyptien(ne)", "Espagnol(e)", "Éthiopien(ne)", "Français(e)", "Gabonais(e)", "Grec(que)", "Indien(ne)", "Indonésien(ne)", "Iranien(ne)", "Ivoirien(ne)", "Italien(ne)", "Japonais(e)", "Kényan(ne)", "Libanais(e)", "Malgache", "Malawien(ne)", "Malien(ne)", "Marocain(e)", "Mauricien(ne)", "Mexicain(e)", "Mozambicain(e)", "Nigérian(ne)", "Norvégien(ne)", "Pakistanais(e)", "Néerlandais(e)", "Philippin(e)", "Polonais(e)", "Portugais(e)", "Russe", "Sénégalais(e)", "Seychellois(e)", "Sud-Africain(e)", "Suédois(e)", "Suisse", "Tanzanien(ne)", "Thaïlandais(e)", "Tunisien(ne)", "Turc(que)", "Ukrainien(ne)", "Vietnamien(ne)"];
const paysBourses = ["Afrique du Sud", "Algérie", "Allemagne", "Algerie", "Arabie Saoudite", "Australie", "Autriche", "Belgique", "Brésil", "Canada", "Chine", "Colombie", "Corée du Sud", "Cuba", "Danemark", "Égypte", "Émirats Arabes Unis", "Espagne", "États-Unis", "Finlande", "France", "Inde", "Indonésie", "Hongrie", "Irlande", "Italie", "Japon", "Libye", "Luxembourg", "Madagascar", "Malaisie", "Maroc", "Mexique", "Maurice", "Norvège", "Nouvelle-Zélande", "Pays-Bas", "Portugal", "Qatar", "La Réunion", "Roumanie", "Royaume-Uni", "Russie", "Seychelles", "Sénégal", "Singapour", "Suède", "Suisse", "Taiwan", "Tunisie", "Turquie"];

type DepotExterne = {
  nature_bourse: string;
  specialite: string;
  organisme_sollicite: string;
  date_depart: string;
};

// Définir un type pour toutes les données du formulaire
type FormDataState = {
  // Étape 1: candidat
  region_origine: number;
  nom: string;
  prenom: string;
  sexe: string;
  jour_datenaissance: string;
  mois_datenaissance: string;
  annee_datenaissance: string;
  date_naissance: string;
  lieu_naissance: string;
  age: number;
  nationalite: string;
  situation_familiale: string;
  conjoint_employeur_nom: string;
  conjoint_employeur_adresse: string;
  logement_adresse: string;
  logement_region_id: number;
  email: string;
  telephone: string;
  //pere_nom: string;
  //pere_profession: string;
  //mere_nom: string;
  //mere_profession: string;
  //tuteur_nom: string;
  //tuteur_profession: string;
  urgence_nom: string;
  urgence_adresse: string;
  urgence_telephone: string;

  nombre_enfants: number;
  nombre_enfants_acharge: number;

  dernier_diplome_id: number;
  dernier_diplome_annee: string;
  
  // Étape 2: baccalaureat
  type_bac: string;
  serie_bac: string;
  mention_bac: string;
  annee_obtention: string;
  numero_inscription: string;
  bacc_province_id: number;
  
  // Étape 3: demande
  specialites: string;
  pays_demandes: string;
  
  organisme_sollicite: string;
  organisme_detail_contact: string;
  //organisme_lettre_accueil: string;

  autre_depot_externe: boolean | null;
  nombre_depot_externe: number;

  autresdepot_nature_bourse: string;
  autresdepot_specialite: string;
  autresdepot_organisme_sollicite: string;
  autresdepot_date_depart: string;

  depots_externes: DepotExterne[];

  login_identifiant: string;

  new_login_nom: string;
  new_login_prenom: string;
  new_login_email: string;
  new_login_password: string;
  new_login_confirmation: string;
};

export default function CandidaturePostUniversitaireForm({
  regions,
  provinces,
  typesBourse,
  diplomes,
  defaultPaysDemande,
}: Props) {
  const { user, login, logout, loginInForm, logoutInForm } = useSession();
  
  //LOGIN
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const [loading, setLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [formState, setFormState] = useState<Record<string, any>>({})
  const router = useRouter()

  const STEPS = [
    { id: 1, title: "Informations du candidat" },
    { id: 2, title: "Informations sur le diplôme" },
    { id: 3, title: "Études à poursuivre" },
    { id: 4, title: "Pièces jointes" },
    { id: 5, title: "Finalisation" },
  ]
  const [currentStep, setCurrentStep] = useState(1)
  const nextStep = () => setCurrentStep((s) => Math.min(s + 1, 5))
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 1))
  const stepVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  }

  // State pour toutes les données du formulaire
  const [formData, setFormData] = useState<FormDataState>({
    region_origine: 0,
    nom: '',
    prenom: '',
    sexe: '',
    jour_datenaissance: '',
    mois_datenaissance: '',
    annee_datenaissance: '',
    date_naissance: '',
    lieu_naissance: '',
    age: 0,
    nationalite: '',
    situation_familiale: '',
    conjoint_employeur_nom: '',
    conjoint_employeur_adresse: '',
    logement_adresse: '',
    logement_region_id: 0,
    email: '',
    telephone: '',
    urgence_nom: '',
    urgence_adresse: '',
    urgence_telephone: '',
    nombre_enfants: 0,
    nombre_enfants_acharge: 0,
    dernier_diplome_id: 0,
    dernier_diplome_annee: '',
    
    type_bac: '',
    serie_bac: '',
    mention_bac: '',
    annee_obtention: '',
    numero_inscription: '',
    bacc_province_id: 0,

    specialites: '',
    pays_demandes: '',
    organisme_sollicite: '',
    organisme_detail_contact: '',
    //organisme_lettre_accueil: '',

    autre_depot_externe: null,
    nombre_depot_externe: 0,
    autresdepot_nature_bourse: '',
    autresdepot_specialite: '',
    autresdepot_organisme_sollicite: '',
    autresdepot_date_depart: '',
    depots_externes: [],

    login_identifiant: '',

    new_login_nom: '',
    new_login_prenom: '',
    new_login_email:  '',
    new_login_password:  '',
    new_login_confirmation:  '',
  });

  const defaultPays = defaultPaysDemande?.pays || "";
  useEffect(() => {
    if (defaultPaysDemande) {
      setFormData(prev => ({ ...prev, pays_demandes: defaultPaysDemande.pays }));
    }
  }, [defaultPaysDemande]);

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formLoginData = new FormData(e.currentTarget);
    const email = formLoginData.get("authentification_email") as string;
    const password = formLoginData.get("authentification_password") as string;

    const payload = {
        ...formData,
        utilisateur: currentUser 
        ? { id: currentUser.id, email: currentUser.email } 
        : {
            email: formData.new_login_email,
            password: formData.new_login_password,
            nom: formData.new_login_nom,
            prenom: formData.new_login_prenom,
          },
    };

    try {
      const response = await fetch('/api/authentification/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
          loginInForm(data.id, data.email); 
          setIsLoginOpen(false); 
      } else {
          alert(data.message || "Erreur de connexion");
      }
    } catch (error) {
        alert("Le serveur de connexion est injoignable.");
    } finally {
        setLoading(false);
    }
  };

  // Gestionnaire générique pour les champs de formulaire
  /*const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };*/
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const nextState = { ...prev, [name]: value };
      if (name === "email" && prev.new_login_email === prev.email) {
        nextState.new_login_email = value;
      }
      if (name === "nom" && prev.new_login_nom === prev.nom) {
        nextState.new_login_nom = value;
      }
      if (name === "prenom" && prev.new_login_prenom === prev.prenom) {
        nextState.new_login_prenom = value;
      }
      return nextState;
    });
  };

  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nouveauNombre = parseInt(e.target.value) || 0;
    setFormData(prev => {
        let nouveauxDepots = [...prev.depots_externes];
        if (nouveauNombre > nouveauxDepots.length) {
            // On ajoute des groupes vides si le nombre augmente
            const difference = nouveauNombre - nouveauxDepots.length;
            for (let i = 0; i < difference; i++) {
                nouveauxDepots.push({
                    nature_bourse: "",
                    specialite: "",
                    organisme_sollicite: "",
                    date_depart: ""
                });
            }
        } else {
            // On supprime les derniers dans le tableau si le nombre diminue
            nouveauxDepots = nouveauxDepots.slice(0, nouveauNombre);
        }
        return { 
            ...prev, 
            nombre_depot_externe: nouveauNombre, 
            depots_externes: nouveauxDepots 
        };
    });
  };
  const handleDepotFieldChange = (index: number, field: any, value: any) => {
    setFormData(prev => {
        const nouveauxDepots = [...prev.depots_externes];
        nouveauxDepots[index] = { ...nouveauxDepots[index], [field]: value };
        return { ...prev, depots_externes: nouveauxDepots };
    });
  };

  useEffect(() => {
    if (user) {
        setCurrentUser(user);
    } else {
        setCurrentUser(null);
    }
  }, [user]);

  useEffect(() => {
    if (formData.situation_familiale !== "marie") {
      setFormData(prev => ({
        ...prev,
        conjoint_employeur_nom: "",
        conjoint_employeur_adresse: ""
      }));
    }
  }, [formData.situation_familiale]);

  useEffect(() => {
    if (formData.autre_depot_externe !== true) {
      setFormData(prev => ({
        ...prev,
        autresdepot_nature_bourse: "",
        autresdepot_specialite: "",
        autresdepot_organisme_sollicite: "",
        autresdepot_date_depart: ""
      }));
    }
  }, [formData.autre_depot_externe]);

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [autresPieces, setAutresPieces] = useState<number[]>([])
  //const [files, setFiles] = useState<Record<string, File | null>>({})
  const [files, setFiles] = useState<Record<string, File | File[] | null>>({});
  const [fileLettreAccueil, setFileLettreAccueil] = useState<Record<string, File | File[] | null>>({});

  const [dateNaissance, setDateNaissance] = useState("");
  const [age, setAge] = useState<number | string>('');
  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const dateInput = e.target.value;
    setDateNaissance(dateInput);

    if (dateInput) {
      const birthDate = new Date(dateInput);
      const today = new Date();
      
      let calculeAge = today.getFullYear() - birthDate.getFullYear();
      const mois = today.getMonth() - birthDate.getMonth();

      // Ajustement si l'anniversaire n'est pas encore passé cette année
      if (mois < 0 || (mois === 0 && today.getDate() < birthDate.getDate())) {
        calculeAge--;
      }

      const ageValue = calculeAge > 0 ? calculeAge : 0;
      setAge(calculeAge > 0 ? calculeAge : 0);
      setFormData(prev => ({ ...prev, age: ageValue }));
    } else {
      setAge(0);
      setFormData(prev => ({ ...prev, age: 0 }));
    }
  };

  const [nationalitValue, setNationaliteValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  // Filtrer la liste selon la saisie
  const filteredList = nationalites.filter(n => 
    n.toLowerCase().includes(nationalitValue.toLowerCase())
  );
  
  const filteredPaysList = paysBourses.filter(n => 
    n.toLowerCase().includes(nationalitValue.toLowerCase())
  );

  //NUMERO TELEPHONE
  const [phone, setPhone] = useState('');
  const [urgePhone, setUrgePhone] = useState('');
  const formatPhoneNumber = (value: string) => {
    // 1. On garde uniquement les chiffres
    const digits = value.replace(/\D/g, '');
    // 2. On découpe et on ajoute les espaces selon le format : 3-2-3-2
    const parts = [];
    if (digits.length > 0) parts.push(digits.substring(0, 3));
    if (digits.length > 3) parts.push(digits.substring(3, 5));
    if (digits.length > 5) parts.push(digits.substring(5, 8));
    if (digits.length > 8) parts.push(digits.substring(8, 10));

    return parts.join(' ');
  };
  const handleNumeroTelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    // On limite à 13 caractères (10 chiffres + 3 espaces)
    if (formattedValue.length <= 13) {
      setPhone(formattedValue);
      //setFormData(prev => ({ ...prev, telephone: formattedValue }));
    }
  }
  const handleUrgenceTelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    // On limite à 13 caractères (10 chiffres + 3 espaces)
    if (formattedValue.length <= 13) {
      setUrgePhone(formattedValue);
      //setFormData(prev => ({ ...prev, urgence_telephone: formattedValue }));
    }
  }

  //DATE DE NAISSANCE
  const [dateParts, setDateParts] = useState({
    day: "",
    month: "",
    year: "",
  })
  const MONTHS = [
    { value: "01", label: "Janvier" },
    { value: "02", label: "Février" },
    { value: "03", label: "Mars" },
    { value: "04", label: "Avril" },
    { value: "05", label: "Mai" },
    { value: "06", label: "Juin" },
    { value: "07", label: "Juillet" },
    { value: "08", label: "Août" },
    { value: "09", label: "Septembre" },
    { value: "10", label: "Octobre" },
    { value: "11", label: "Novembre" },
    { value: "12", label: "Décembre" },
  ]
  const format2Digits = (value?: string | number) => {
    if (!value) return ""
    const num = Number(value)
    return num < 10 ? `0${num}` : String(num)
  }
  const updateDateNaissance = (next: Partial<typeof dateParts>) => {
    const updated = { ...dateParts, ...next }
    const day = format2Digits(updated.day)
    const month = format2Digits(updated.month)
    const year = updated.year
    //setDateParts(updated)
    setDateParts({
      ...updated,
      day,
      month,
    })

    if (day && month && year) {
      //date_naissance
      const formattedDate = `${year}-${month}-${day}`
      setFormState((prev) => ({
        ...prev,
        date_naissance: formattedDate,
      }))
      setDateNaissance(formattedDate)

      //age
      const today = new Date();
      let calculeAge = today.getFullYear() - Number(year);
      const mois = today.getMonth() - Number(month);
      // Ajustement si l'anniversaire n'est pas encore passé cette année
      if (mois < 0 || (mois === 0 && today.getDate() < Number(day))) {
        calculeAge--;
      }
      setAge(calculeAge > 0 ? calculeAge : 0);
    }
  }

  //PAYS DEMANDE
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // Conversion String -> Array pour l'affichage des tags
  const selectedPays = formData.pays_demandes 
    ? formData.pays_demandes.split(', ').filter(p => p !== "") 
    : [];
  const togglePays = (pays: string) => {
    let newSelection;
    if (selectedPays.includes(pays)) {
      newSelection = selectedPays.filter(p => p !== pays);
    } else {
      newSelection = [...selectedPays, pays];
    }
    // Mise à jour du formData au format "France, Maroc"
    setFormData({ ...formData, pays_demandes: newSelection.join(', ') });
    setSearchTerm(""); 
  };
  const filteredPays = paysBourses.filter(p => 
    p.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formRef = useRef<HTMLFormElement>(null);

  // Fonction de réinitialisation manuelle
  const handleReset = () => {
    if (formRef.current) {
      // Réinitialisation standard du formulaire
      formRef.current.reset();
    }
    
    // Réinitialiser tous les états
    setFormData({
      region_origine: 0,
      nom: '',
      prenom: '',
      sexe: '',
      jour_datenaissance: '',
      mois_datenaissance: '',
      annee_datenaissance: '',
      date_naissance: '',
      lieu_naissance: '',
      age: 0,
      nationalite: '',
      situation_familiale: '',
      conjoint_employeur_nom: '',
      conjoint_employeur_adresse: '',
      logement_adresse: '',
      logement_region_id: 0,
      email: '',
      telephone: '',
      urgence_nom: '',
      urgence_adresse: '',
      urgence_telephone: '',
      nombre_enfants: 0,
      nombre_enfants_acharge: 0,
      
      dernier_diplome_id: 0,
      dernier_diplome_annee: '',
      type_bac: '',
      serie_bac: '',
      mention_bac: '',
      annee_obtention: '',
      numero_inscription: '',
      bacc_province_id: 0,

      specialites: '',
      pays_demandes: '',
      organisme_sollicite: '',
      organisme_detail_contact: '',
      //organisme_lettre_accueil: '',

      autre_depot_externe: null,
      nombre_depot_externe: 0,
      autresdepot_nature_bourse: '',
      autresdepot_specialite: '',
      autresdepot_organisme_sollicite: '',
      autresdepot_date_depart: '',
      depots_externes: [],

      login_identifiant: '',

      new_login_nom: '',
      new_login_prenom: '',
      new_login_email: '',
      new_login_password: '',
      new_login_confirmation:  '',
    });

    // Réinitialiser les états pour les fichiers
    setFiles({});
    setFileLettreAccueil({});
    // Réinitialiser autresPieces
    setAutresPieces([]);
    // Réinitialiser les autres états si nécessaire
    setDateNaissance('');
    setAge('');
    setNationaliteValue("");
    setIsOpen(false);
    setPhone('');
    setUrgePhone('');
    setDateParts({day: '', month: '', year: ''})
  };

  async function uploadSingleFile(file: File, numeroDossier: string, pieceKey: string) {
    const fd = new FormData()
    fd.append("file", file)
    fd.append("numero_dossier", numeroDossier)
    fd.append("piece_key", pieceKey)

    const res = await fetch("/api/upload", {
      method: "POST",
      body: fd,
    })

    if (!res.ok) {
      throw new Error("Erreur upload fichier")
    }

    return res.json() as Promise<{
      success: boolean
      nom_fichier: string
      chemin_public: string
    }>
  }

  const [modal, setModal] = useState<{
    open: boolean
    type: "success" | "error" | "warning" | "info"
    title: string
    message: string | ReactNode
    onClose?: () => void
  }>({
    open: false,
    type: "info",
    title: "",
    message: "",
    onClose: undefined,
  })

  function SuccessMessage({
    numeroDossier,
  }: {
    numeroDossier: string
  }) {
    const [copied, setCopied] = useState(false)
    const copyNumeroDossier = async () => {
      try {
        await navigator.clipboard.writeText(numeroDossier)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (e) {
        console.error("Erreur copie presse-papiers", e)
      }
    }

    const dateExpiration = new Date()
    dateExpiration.setFullYear(dateExpiration.getFullYear() + 2)
    const dateFormatee = dateExpiration.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })

    return (
      <div className="space-y-4">
        <p>
          Votre candidature à la bourse <strong>Post Universitaire</strong> a bien été envoyée.
          Merci de conserver le numéro de dossier ci-dessous pour tout suivi ultérieur.
        </p>

        <div className="flex flex-col items-center gap-2">
          <div className="border-2 border-dotted border-green-600 rounded-lg px-6 py-3 text-lg font-bold tracking-widest text-green-700">
            {numeroDossier}
          </div>

          <button
            type="button"
            onClick={copyNumeroDossier}
            className="inline-flex items-center gap-2 rounded-md bg-(--color-theme-green) px-4 py-2 text-sm font-medium text-white hover:bg-(--color-theme-yellow) transition"
          >
            <Copy className="w-5 h-5" />
            Copier le numéro
          </button>

          {copied && (
            <span className="flex items-center gap-1 text-sm text-green-600 animate-in fade-in zoom-in duration-200">
              Numéro de dossier copié <CheckCheck className="w-4 h-4" />
            </span>
          )}
        </div>
        <p className="text-(--color-theme-dark-blue) mt-5">
          Veuillez noter que votre dossier est valable jusqu'au<br/><span className="text-(--color-theme-green) font-semibold">{dateFormatee}</span>.
        </p>
      </div>
    )
  }

  const validateStep = () => {
    const form = formRef.current
    if (!form) return false;

    // Validation par étape
    switch (currentStep) {
      case 1:
      case 2:
      case 3:
      case 5:
        return form.checkValidity()
        
      case 4:
        const isFormValid = form.checkValidity();
        const requiredFileNames = [
          "piece_0", "piece_1", "piece_2", "piece_3", "piece_4", 
          "piece_5", "piece_6", "piece_7", "piece_8"
        ];
        const allFilesPresent = requiredFileNames.every(name => {
          const file = files[name];
          // Vérifie si c'est un tableau non vide ou un fichier simple non nul
          return Array.isArray(file) ? file.length > 0 : !!file;
        });
        return isFormValid && allFilesPresent;

      default:
        return true
    }
    //return form.checkValidity()
  }
  const handleNextStep = () => {
    if (currentStep === STEPS.length) return

    setHasSubmitted(true);

    if (validateStep()) {
      nextStep()
      setHasSubmitted(false); 
    } else {
      formRef.current?.reportValidity()
    }
  }
  const handlePrevStep = () => {
    if (currentStep === 1) return
    prevStep()
  }

  // Fonction pour créer le FormData à envoyer
  const createFormDataForSubmit = (): FormData => {
    const fd = new FormData();
    
    // Ajouter tous les champs textuels
    Object.entries(formData).forEach(([key, value]) => {
      fd.append(key, String(value));
    });
    
    return fd;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setHasSubmitted(true);

    try {
      //const numeroDossier = await getNextNumeroDossier();
      const numeroDossier = "BPU_TEMP_0000";
      const formDataObj = createFormDataForSubmit();

      const uploadedFiles: Array<{
        type_piece: string
        nom_fichier: string
      }> = []

      const pieceNames = [
        "Copie du dernier diplôme obtenu (ou Attestation de réussite)",
        "Copie du relevé de notes des 3 dernières années",
        "Copie légalisée du diplôme de baccalauréat",
        "Copie d'acte de naissance",
        "Certificat de nationalité",
        "Copie certifiée conforme du passeport",
        "Casier judiciaire",
        "Photo d'identité récente",
        "Certificat médical",
      ]
      const pieceNamesDim = [
        "copie_dernier_diplome",
        "releve_de_notes_3_dernieres_annee",
        "copie_diplome_baccalaureat",
        "acte_de_naissance",
        "certificat_de_nationalite",
        "copie_passeport",
        "casier_judiciaire",
        "photo_identite",
        "certificat_medical",
      ]

      const formIsValid = pieceNames.every((_, i) => {
        const val = files[`piece_${i}`];
        return val && (!Array.isArray(val) || val.length > 0);
      });

      if (!formIsValid) {
        // Message global optionnel
        setModal({
          open: true,
          type: "error",
          title: "Pièces jointes obligatoires!",
          message:
            "Veuillez ajouter les documents manquants pour valider votre demande.",
        })
        return;
      }

      /* =====================================================
        1️⃣ CONSTRUIRE LA LISTE DES PROMISES D’UPLOAD
        ===================================================== */
      const uploadPromises: Promise<void>[] = []

      for (let i = 0; i < pieceNames.length; i++) {
        const typePiece = pieceNames[i]
        const pieceKey = pieceNamesDim[i]
        const key = `piece_${i}`
        const value = files[key]

        if (!value || (Array.isArray(value) && value.length === 0)) {
          //alert(`Erreur : Le document "${typePiece}" est obligatoire.`);
          setModal({
            open: true,
            type: "error",
            title: "Pièce jointe manquante!",
            message:
              `Le document "${typePiece}" est obligatoire.`,
          })
          return;
        }
        //if (!value) continue

        if (Array.isArray(value)) {
          value.forEach((file, index) => {
            const finalPieceKey = value.length > 1 
            ? `${pieceKey}_(${index + 1})` 
            : pieceKey;
            
            uploadPromises.push(
              uploadSingleFile(file, numeroDossier, finalPieceKey).then((uploaded) => {
                uploadedFiles.push({
                  type_piece: typePiece,
                  nom_fichier: uploaded.nom_fichier,
                })
              })
            )
          })
        } else {
          uploadPromises.push(
            uploadSingleFile(value, numeroDossier, pieceKey).then((uploaded) => {
              uploadedFiles.push({
                type_piece: typePiece,
                nom_fichier: uploaded.nom_fichier,
              })
            })
          )
        }
      }

      // 🔹 AUTRES PIÈCES
      for (const id of autresPieces) {
        const key = `autre_piece_${id}`
        const file = files[key]

        if (file && !Array.isArray(file)) {
          uploadPromises.push(
            uploadSingleFile(file, numeroDossier, `autre_piece_${id}`).then((uploaded) => {
              uploadedFiles.push({
                type_piece: "Autre pièce",
                nom_fichier: uploaded.nom_fichier,
              })
            })
          )
        }
      }

      // 🔹 LETTRE D'ACCUEIL (PIÈCE UNIQUE)
      const lettreAccueilFile = files["organisme_lettre_accueil"]
      if (lettreAccueilFile && !Array.isArray(lettreAccueilFile)) {
      uploadPromises.push(
        uploadSingleFile(
            lettreAccueilFile,
            numeroDossier,
            "lettre_accueil_organisme"
        ).then((uploaded) => {
            uploadedFiles.push({
                type_piece: "Lettre d'accueil",
                nom_fichier: uploaded.nom_fichier,
            })
        })
      )
      }

      /* =====================================================
        2️⃣ LANCEMENT DES UPLOADS EN PARALLÈLE
        ===================================================== */
      await Promise.all(uploadPromises)

      if (uploadedFiles.length === 0) {
        throw new Error("Aucun fichier uploadé")
      }

      // VALIDATION DU COMPTE UTILISATEUR (Si non connecté)
      if (!currentUser) {
        if (!formData.new_login_email) {
          setModal({ open: true, type: "error", title: "Erreur", message: "L'adresse email est requise pour créer votre compte." });
          setModal({
            open: true,
            type: "error",
            title: "Champ adresse email obligatoire",
            message: "L'adresse email est requise pour créer votre compte.",
          });
          setLoading(false); 
          return;
        }
        
        if (!formData.new_login_password || formData.new_login_password.length <= 6) {
          setModal({
            open: true,
            type: "error",
            title: "Sécurité du compte",
            message: "Le mot de passe doit contenir au moins : 6 caractères, 1 chiffre, 1 majuscule",
          });
          setLoading(false);
          return;
        }

        if (formData.new_login_password !== formData.new_login_confirmation) {
          setModal({
            open: true,
            type: "error",
            title: "Mots de passe de confirmation incorrect",
            message: "La confirmation du mot de passe ne correspond pas au mot de passe saisi.",
          });
          setLoading(false);
          return;
        }
      }

      /* =====================================================
        3️⃣ SERVER ACTION (JSON SEULEMENT)
        ===================================================== */
      const data = {
        region_origine: Number(formData.region_origine) || 0,
        nom: formData.nom || "",
        prenom: formData.prenom || "",
        sexe: (formData.sexe as "Masculin" | "Feminin") || "",
        date_naissance: dateNaissance || "",
        lieu_naissance: formData.lieu_naissance || "",
        age: Number(age) || 0,
        nationalite: nationalitValue || "",
        situation_familiale: (formData.situation_familiale as 
          | "celibataire"
          | "marie"
          | "divorce"
          | "veuf") || "",
        conjoint_employeur_nom: formData.conjoint_employeur_nom || "",
        conjoint_employeur_adresse: formData.conjoint_employeur_adresse || "",

        logement_adresse: formData.logement_adresse || "",
        logement_region_id: Number(formData.logement_region_id) || 0,

        email: formData.email || "",
        telephone: phone || "",

        urgence_nom: formData.urgence_nom || "",
        urgence_adresse: formData.urgence_adresse || "",
        urgence_telephone: urgePhone || "",

        nombre_enfants: Number(formData.nombre_enfants) || 0,
        nombre_enfants_acharge: Number(formData.nombre_enfants_acharge) || 0,

        dernier_diplome_id: Number(formData.dernier_diplome_id) || 0,
        dernier_diplome_annee: Number(formData.dernier_diplome_annee) || 0,

        type_bac: (formData.type_bac as "General" | "Technique") || "",
        serie_bac: (formData.serie_bac as
          | "A1"
          | "A2"
          | "C"
          | "D"
          | "L"
          | "S"
          | "OSE"
          | "Technique") || "",
        mention_bac: (formData.mention_bac as
          | "tres_bien"
          | "bien"
          | "assez_bien"
          | "passable") || "",
        annee_obtention: Number(formData.annee_obtention) || 0,
        numero_inscription: formData.numero_inscription || "",
        bacc_province_id: Number(formData.bacc_province_id) || 0,

        type_bourse_id: 2,
        specialites: formData.specialites || "",
        pays_demandes: formData.pays_demandes || "",

        organisme_sollicite: formData.organisme_sollicite || "",
        organisme_detail_contact: formData.organisme_detail_contact || "",
        //organisme_lettre_accueil: [{type_piece: "Lettre d'accueil", nom_fichier: "vide.txt"}],

        autre_depot_externe: formData.autre_depot_externe || false,
        nombre_depot_externe: Number(formData.nombre_depot_externe) || 0,
        
        autresdepot_nature_bourse: formData.autresdepot_nature_bourse || "",
        autresdepot_specialite: formData.autresdepot_specialite || "",
        autresdepot_organisme_sollicite: formData.autresdepot_organisme_sollicite || "",
        autresdepot_date_depart: formData.autresdepot_date_depart || "",

        depots_externes: formData.depots_externes || [],

        pieces_jointes: uploadedFiles.length > 0 ? uploadedFiles : [{type_piece: "Vide", nom_fichier: "vide.txt"}],
        numero_dossier: numeroDossier,

        utilisateur: currentUser
        ? { id: currentUser.id, email: currentUser.email }
        : {
            email: formData.new_login_email,
            password: formData.new_login_password,
            nom: formData.new_login_nom,
            prenom: formData.new_login_prenom,
          },
        
        annonce_bourse_id: defaultPaysDemande?.id,
      };

      const result = await creerCandidaturePostUniversitaire(data as any)

      if (result?.success) {
        const currentNumeroDossier = (result as any).currentNumeroDossier ?? "Numéro inconnu";

        console.log("Erreur serveur:", result.errors);
        //alert(`Votre dossier ${numeroDossier} a bien été envoyé`)
        /*setModal({
          open: true,
          type: "success",
          title: "Candidature enregistrée avec succès",
          message: `Votre dossier portant le numéro ${numeroDossier} a bien été envoyé.
          Veuillez conserver ce numéro pour tout suivi ultérieur.`,
        })*/
        setModal({
          open: true,
          type: "success",
          title: "Candidature enregistrée avec succès",
          message: <SuccessMessage numeroDossier={currentNumeroDossier} />,
          onClose: () => {
            handleReset()
            setCurrentStep(1)
            setHasSubmitted(false)
            //window.location.reload();
            router.refresh()
          },
        })
        handleReset()
      } else {
        console.log(result.errors || result.message)
        //alert(result.message || "Erreur lors de l'enregistrement")

        setModal({
          open: true,
          type: "error",
          title: "Erreur d'enregistrement",
          message:
            "Une erreur est survenue lors de l’enregistrement de votre candidature. Merci de vérifier les informations saisies et réessayer.",
        })
      }
    } catch (error) {
      console.log(error)
      //alert("Erreur lors de l'envoi de la candidature")

      setModal({
        open: true,
        type: "error",
        title: "Erreur d'exécution du formulaire",
        message:
          "Une erreur est survenue lors de l’exécution du formulaire de candidature. Merci de réessayer ou contacter le service de la bourse",
      })
    } finally {
      setLoading(false)
    }
  }


  return (
  <div>

    <div className="max-w-6xl mx-auto mb-12">
      <ol className="relative flex items-start justify-between">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200" />

        {/* Ligne active */}
        <div
          className="absolute top-5 left-0 h-0.5 bg-(--color-theme-green) transition-all duration-500"
          style={{
            width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`,
          }}
        />

        {STEPS.map((step) => {
          const isActive = currentStep === step.id
          const isCompleted = currentStep > step.id

          return (
            <li
              key={step.id}
              className="relative z-10 flex flex-col items-center flex-1 text-center"
            >
              {/* Cercle */}
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold
                  transition-all duration-300
                  ${
                    isCompleted
                      ? "bg-(--color-theme-green) text-white"
                      : isActive
                      ? "bg-(--color-theme-yellow) text-white scale-110 shadow-lg"
                      : "bg-white border-2 border-gray-300 text-gray-400"
                  }
                `}
              >
                {isCompleted ? <Check /> : step.id}
              </div>

              {/* Titre */}
              <span
                className={`
                  mt-3 text-sm font-medium transition-colors duration-300
                  ${
                    isActive
                      ? "text-(--color-theme-yellow)"
                      : isCompleted
                      ? "text-(--color-theme-green)"
                      : "text-gray-500"
                  }
                `}
              >
                {step.title}
              </span>
            </li>
          )
        })}
      </ol>
    </div>


    <form ref={formRef} 
      //action={handleSubmit} 
      onSubmit={handleSubmit}
      className="space-y-8 max-w-6xl mx-auto p-0">
      
      <div className="flex items-center justify-between w-full">
        <div className="text-(--color-theme-red) text-sm">
            (*) Champ obligatoire
        </div>

        <div className="inline-flex gap-3 items-center">
            {/* PRÉCÉDENT */}
            <button
            type="button"
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            className={`
                inline-flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition
                ${
                currentStep === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-(--color-theme-green) text-white hover:bg-(--color-theme-yellow) hover:text-(--color-theme-dark-blue)"
                }
            `}
            >
            <ArrowLeft className="w-4 h-4" />
            </button>

            {/* INDICATEUR */}
            <span className="text-sm text-gray-500 whitespace-nowrap">
            Etape <strong>{currentStep}</strong> sur <strong>{STEPS.length}</strong>
            </span>

            {/* SUIVANT */}
            <button
            type="button"
            onClick={handleNextStep}
            disabled={currentStep === STEPS.length}
            className={`
                inline-flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition
                ${
                currentStep === STEPS.length
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-(--color-theme-green) text-white hover:bg-(--color-theme-yellow) hover:text-(--color-theme-dark-blue)"
                }
            `}
            >
            <ArrowRight className="w-4 h-4" />
            </button>
        </div>
      </div>

      {/* ETAPE 1 */}
      {/* ===================== REGION ORIGINE / CANDIDAT ===================== */}
      
        {currentStep === 1 && (
          <motion.div
            variants={stepVariants}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.35 }}
          >
            {/* ===================== REGION ORIGINE ===================== */}
            <fieldset className="border border-(--color-theme-green) rounded-lg p-6 space-y-6">
              <legend className="font-semibold text-xl px-2 text-(--color-theme-blue2)">
                Région d'origine
              </legend>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Région d'origine" showLabel={false}>
                  <select name="region_origine" required className="input transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2) user-invalid:border-red-500 user-invalid:ring-red-500 user-invalid:outline-red-500"
                    value={formData.region_origine}
                    onChange={handleInputChange}
                  >
                    <option value="0" disabled className="text-gray-400">Sélectionnez votre région</option>
                    {regions.map(r => (
                      <option key={r.id} value={r.id}>{r.libelle}</option>
                    ))}
                  </select>
                </Field>
              </div>
            </fieldset>

            {/* ===================== CANDIDAT ===================== */}
            <fieldset className="border border-(--color-theme-green) rounded-lg p-6 space-y-6 mt-10">
              <legend className="font-semibold text-xl px-2 text-(--color-theme-blue2)">
                Renseignements concernant le/la candidat(e)
              </legend>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Field label="Nom">
                  <input type="text" name="nom" required className="input transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2) user-invalid:border-red-500 user-invalid:ring-red-500 user-invalid:outline-red-500" 
                    value={formData.nom}
                    onChange={handleInputChange}
                  />
                </Field>

                <Field label="Prénom">
                  <input type="text" name="prenom" required className="input transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2) user-invalid:border-red-500 user-invalid:ring-red-500 user-invalid:outline-red-500" 
                    value={formData.prenom}
                    onChange={handleInputChange}
                  />
                </Field>

                <Field label="Sexe">
                  <select name="sexe" required className="input transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2) user-invalid:border-red-500 user-invalid:ring-red-500 user-invalid:outline-red-500"
                    value={formData.sexe}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled className="text-gray-400">Sélectionnez</option>
                    <option value="Masculin">Masculin</option>
                    <option value="Feminin">Féminin</option>
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/*<Field label="Date de naissance">
                  <input type="date" name="date_naissance" required className="input transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2) user-invalid:border-red-500 user-invalid:ring-red-500 user-invalid:outline-red-500" 
                    value={dateNaissance} onChange={handleDateChange} 
                  />
                </Field>*/}
                <Field label="Date de naissance">
                  <div className="grid grid-cols-4 gap-3">
                    {/*<input type="hidden" name="date_naissance" className="input transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2) user-invalid:border-red-500 user-invalid:ring-red-500 user-invalid:outline-red-500" 
                      value={dateNaissance}
                    />*/}
                    <input
                      type="number"
                      name="jour_datenaissance"
                      min={1}
                      max={31}
                      placeholder="Jour"
                      value={dateParts.day}
                      onChange={(e) =>
                        updateDateNaissance({ day: e.target.value })
                      }
                      className="input transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2) user-invalid:border-red-500 user-invalid:ring-red-500 user-invalid:outline-red-500"
                      required
                    />

                    <select
                      value={dateParts.month}
                      name="mois_datenaissance"
                      onChange={(e) =>
                        updateDateNaissance({ month: e.target.value })
                      }
                      className="input col-span-2 transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2) user-invalid:border-red-500 user-invalid:ring-red-500 user-invalid:outline-red-500"
                      required
                    >
                      <option value="" disabled className="text-gray-400">Mois</option>
                      {MONTHS.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      name="annee_datenaissance"
                      placeholder="Année"
                      min={1900}
                      max={new Date().getFullYear()}
                      value={dateParts.year}
                      onChange={(e) =>
                        updateDateNaissance({ year: e.target.value })
                      }
                      onInput={(e) => {
                        // Force la limite de 4 caractères lors de la saisie
                        if (e.currentTarget.value.length > 4) {
                          e.currentTarget.value = e.currentTarget.value.slice(0, 4);
                        }
                      }}
                      className="input transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2) user-invalid:border-red-500 user-invalid:ring-red-500 user-invalid:outline-red-500"
                      required
                    />
                  </div>
                </Field>

                <Field label="Lieu de naissance">
                  <input type="text" name="lieu_naissance" required className="input transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2) user-invalid:border-red-500 user-invalid:ring-red-500 user-invalid:outline-red-500" 
                    value={formData.lieu_naissance}
                    onChange={handleInputChange}
                  />
                </Field>

                <Field label="Age">
                  <input type="Number" name="age" required className="input transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2) user-invalid:border-red-500 user-invalid:ring-red-500 user-invalid:outline-red-500" min={0} 
                    value={age} onChange={(e) => setAge(e.target.value)}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Field label="Nationalité">
                  <div className="relative w-full">
                    <input type="text" name="nationalite" required className="input w-full transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2) user-invalid:border-red-500 user-invalid:ring-red-500 user-invalid:outline-red-500" 
                      value={nationalitValue}  
                      onChange={(e) => {
                        handleInputChange;
                        setNationaliteValue(e.target.value);
                        setIsOpen(true);
                      }}
                      onFocus={() => setIsOpen(true)}
                      onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                    />
                    
                    {/* Le conteneur de suggestions personnalisé */}
                    {isOpen && filteredList.length > 0 && (
                      <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg overflow-y-auto max-h-50">
                        {filteredList.length > 0 ? (
                          filteredList.map((nat, index) => (
                            <li
                              key={index}
                              onClick={() => {
                                setNationaliteValue(nat);
                                setIsOpen(false);
                              }}
                              className="p-2 hover:bg-blue-100 cursor-pointer text-sm text-slate-700"
                            >
                              {nat}
                            </li>
                          ))
                        ) : (
                          <li className="p-3 text-sm text-gray-500">Aucun résultat trouvé</li>
                        )}
                      </ul>
                    )}
                  </div>
                </Field>

                <Field label="Situation familiale">
                  <select name="situation_familiale" required className="input transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2) user-invalid:border-red-500 user-invalid:ring-red-500 user-invalid:outline-red-500"
                    value={formData.situation_familiale}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled className="text-gray-400">Sélectionnez</option>
                    <option value="celibataire">Célibataire</option>
                    <option value="marie">Marié(e)</option>
                    <option value="divorce">Divorcé(e)</option>
                    <option value="veuf">Veuf(ve)</option>
                  </select>
                </Field>
              </div>

              {formData.situation_familiale=="marie" && (
                <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <Field label="Organisme employeur du conjoint" isRequired={false}>
                        <input type="text" name="conjoint_employeur_nom" className="input transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2) user-invalid:border-red-500 user-invalid:ring-red-500 user-invalid:outline-red-500" 
                            value={formData.conjoint_employeur_nom}
                            onChange={handleInputChange}
                        />
                        </Field>

                        <Field label="Adresse de l'organisme employeur du conjoint" isRequired={false} className="md:col-span-2">
                        <input type="text" name="conjoint_employeur_adresse" className="input transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2) user-invalid:border-red-500 user-invalid:ring-red-500 user-invalid:outline-red-500" 
                            value={formData.conjoint_employeur_adresse}
                            onChange={handleInputChange}
                        />
                        </Field>
                    </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Field label="Adresse actuelle du candidat" className="md:col-span-2">
                  <input type="text" name="logement_adresse" required className="input transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2) user-invalid:border-red-500 user-invalid:ring-red-500 user-invalid:outline-red-500" 
                    value={formData.logement_adresse}
                    onChange={handleInputChange}
                  />
                </Field>

                <Field label="Région de résidence" showLabel={false}>
                  <select name="logement_region_id" required className="input transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2) user-invalid:border-red-500 user-invalid:ring-red-500 user-invalid:outline-red-500"
                    value={formData.logement_region_id}
                    onChange={handleInputChange}
                  >
                    <option value="0" disabled className="text-gray-400">Sélectionnez votre région</option>
                    {regions.map(r => (
                      <option key={r.id} value={r.id}>{r.libelle}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Field label="Adresse email">
                  <input type="email" name="email" required className="input transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2) user-invalid:border-red-500 user-invalid:ring-red-500 user-invalid:outline-red-500"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </Field>

                <Field label="Numéro téléphone">
                  <input type="tel" name="telephone" required className="input transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2) user-invalid:border-red-500 user-invalid:ring-red-500 user-invalid:outline-red-500" 
                    value={phone}
                    onChange={handleNumeroTelChange}
                  /> <span className="text-sm font-regular text-slate-500">* ex: 035 00 000 00</span>
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Field label="Nombre d'enfants">
                  <input type="number" name="nombre_enfants" required  min={0} className="input transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2) user-invalid:border-red-500 user-invalid:ring-red-500 user-invalid:outline-red-500" 
                    value={formData.nombre_enfants}
                    onChange={handleInputChange}
                  />
                </Field>

                <Field label="Nombre d'enfants à charge">
                  <input type="number" name="nombre_enfants_acharge" required  min={0} className="input transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2) user-invalid:border-red-500 user-invalid:ring-red-500 user-invalid:outline-red-500" 
                    value={formData.nombre_enfants_acharge}
                    onChange={handleInputChange}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Field label="Personne à prévenir en cas d'urgence">
                  <input type="text" name="urgence_nom" required className="input transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2) user-invalid:border-red-500 user-invalid:ring-red-500 user-invalid:outline-red-500" 
                    value={formData.urgence_nom}
                    onChange={handleInputChange}
                  />
                </Field>

                <Field label="Adresse exacte de la personne à prévenir">
                  <input type="text" name="urgence_adresse" required className="input transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2) user-invalid:border-red-500 user-invalid:ring-red-500 user-invalid:outline-red-500" 
                    value={formData.urgence_adresse}
                    onChange={handleInputChange}
                  />
                </Field>

                <Field label="Numéro téléphone de la personne à prévenir">
                  <input type="tel" name="urgence_telephone" required className="input transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2) user-invalid:border-red-500 user-invalid:ring-red-500 user-invalid:outline-red-500" 
                    value={urgePhone}
                    onChange={handleUrgenceTelChange}
                  /> <span className="text-sm font-regular text-slate-500">* ex: 035 00 000 00</span>
                </Field>
              </div>

            </fieldset>

            {/* ACTIONS / NAVIGATION */}
            <div className="flex flex-wrap items-center justify-end gap-4 pt-10">
              <button type="button" onClick={prevStep} className="inline-flex gap-3 bg-gray-200 text-gray-400 cursor-not-allowed px-8 py-3 rounded-lg" disabled>
                <ArrowLeft className="w-5 h-5" />
                Précédent
              </button>

              <button type="button" 
              onClick={() => {
                if (validateStep()) {
                  nextStep()
                } else {
                  formRef.current?.reportValidity()
                }
              }}
              className="inline-flex gap-3 bg-(--color-theme-green) text-white px-8 py-3 rounded-lg hover:bg-(--color-theme-yellow) hover:text-(--color-theme-dark-blue) disabled:opacity-50 transition">
                Suivant
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      

      {/* ETAPE 2 */}
      {/* ===================== BAC ===================== */}
      
        {currentStep === 2 && (
          <motion.div
            variants={stepVariants}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.35 }}
          >
            <fieldset className="border border-(--color-theme-green) rounded-lg p-6 space-y-6">
              <legend className="font-semibold text-xl px-2 text-(--color-theme-blue2)">
                Informations sur le dernier diplôme obtenu
              </legend>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Field label="Dernier diplôme obtenu">
                  <select name="dernier_diplome_id" required className="input transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2) user-invalid:border-red-500 user-invalid:ring-red-500 user-invalid:outline-red-500"
                    value={formData.dernier_diplome_id}
                    onChange={handleInputChange}
                  >
                    <option value="0" disabled className="text-gray-400">Sélectionnez</option>
                    {diplomes.map(p => (
                      <option key={p.id} value={p.id}>{p.libelle}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Année d'obtention du dernier diplôme">
                  <input type="number" name="dernier_diplome_annee" required  min={1900} className="input transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2) user-invalid:border-red-500 user-invalid:ring-red-500 user-invalid:outline-red-500" 
                    value={formData.dernier_diplome_annee}
                    onChange={handleInputChange}
                    onInput={(e) => {
                      if (e.currentTarget.value.length > 4) {
                        e.currentTarget.value = e.currentTarget.value.slice(0, 4);
                      }
                    }}
                  />
                </Field>
              </div>
            </fieldset>

            <fieldset className="border border-(--color-theme-green) rounded-lg p-6 space-y-6 mt-10">
              <legend className="font-semibold text-xl px-2 text-(--color-theme-blue2)">
                Informations sur le diplôme de Baccalauréat
              </legend>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Catégorie d'enseignement suivi">
                  <select name="type_bac" required className="input transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2) user-invalid:border-red-500 user-invalid:ring-red-500 user-invalid:outline-red-500"
                    value={formData.type_bac}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled className="text-gray-400">Sélectionnez</option>
                    <option value="General">Général</option>
                    <option value="Technique">Technique</option>
                  </select>
                </Field>

                <Field label="Série">
                  <select name="serie_bac" required className="input transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2) user-invalid:border-red-500 user-invalid:ring-red-500 user-invalid:outline-red-500"
                    value={formData.serie_bac}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled className="text-gray-400">Sélectionnez</option>
                    {/*["A1","A2","C","D","L","S","OSE","Technique"].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))*/}
                    {["A1", "A2", "C", "D", "L", "S", "OSE", "Technique"]
                      .filter(s => {
                        if (formData.type_bac === "Technique") {
                          return s === "Technique";
                        } else if (formData.type_bac === "General") {
                          return s !== "Technique";
                        }
                        return true;
                      })
                      .map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))
                    }
                  </select>
                </Field>

                <Field label="Mention obtenue">
                  <select name="mention_bac" required className="input transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2) user-invalid:border-red-500 user-invalid:ring-red-500 user-invalid:outline-red-500"
                    value={formData.mention_bac}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled className="text-gray-400">Sélectionnez</option>
                    <option value="tres_bien">Très bien</option>
                    <option value="bien">Bien</option>
                    <option value="assez_bien">Assez bien</option>
                    <option value="passable">Passable</option>
                  </select>
                </Field>

                <Field label="Année d'obtention du bacc">
                  <input type="number" name="annee_obtention" required  min={1900} className="input transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2) user-invalid:border-red-500 user-invalid:ring-red-500 user-invalid:outline-red-500" 
                    value={formData.annee_obtention}
                    onChange={handleInputChange}
                    onInput={(e) => {
                      if (e.currentTarget.value.length > 4) {
                        e.currentTarget.value = e.currentTarget.value.slice(0, 4);
                      }
                    }}
                  />
                </Field>

                <Field label="Numéro d'inscription au bacc">
                  <input type="number" name="numero_inscription" required min={0} className="input transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2) user-invalid:border-red-500 user-invalid:ring-red-500 user-invalid:outline-red-500" 
                    value={formData.numero_inscription}
                    onChange={handleInputChange}
                  />
                </Field>

                <Field label="Lieu d'obtention du bacc">
                  <select name="bacc_province_id" required className="input transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2) user-invalid:border-red-500 user-invalid:ring-red-500 user-invalid:outline-red-500"
                    value={formData.bacc_province_id}
                    onChange={handleInputChange}
                  >
                    <option value="0" disabled className="text-gray-400">Sélectionnez</option>
                    {provinces.map(p => (
                      <option key={p.id} value={p.id}>{p.libelle}</option>
                    ))}
                  </select>
                </Field>
              </div>
            </fieldset>

            {/* ACTIONS / NAVIGATION */}
            <div className="flex flex-wrap items-center justify-end gap-4 pt-10">
              <button type="button" 
              onClick={prevStep} 
              className="inline-flex gap-3 bg-(--color-theme-green) text-white px-8 py-3 rounded-lg hover:bg-(--color-theme-yellow) hover:text-(--color-theme-dark-blue) disabled:opacity-50 transition">
                <ArrowLeft className="w-5 h-5" /> 
                Précédent
              </button>

              <button type="button" 
              onClick={() => {
                if (validateStep()) {
                  nextStep()
                } else {
                  formRef.current?.reportValidity()
                }
              }}
              className="inline-flex gap-3 bg-(--color-theme-green) text-white px-8 py-3 rounded-lg hover:bg-(--color-theme-yellow) hover:text-(--color-theme-dark-blue) disabled:opacity-50 transition">
                Suivant
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      

      {/* ETAPE 3 */}
      {/* ===================== DEMANDE ===================== */}
      
        {currentStep === 3 && (
          <motion.div
            variants={stepVariants}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.35 }}
          >
            <fieldset className="border border-(--color-theme-green) rounded-lg p-6 space-y-6">
              <legend className="font-semibold text-xl px-2 text-(--color-theme-blue2)">
                Renseignements sur les études à poursuivre
              </legend>
              
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <Field label="Spécialités demandées">
                  <span className="text-xs text-col text-slate-500">(Veuillez utiliser une virgule " , " ou un point-virgule " ; " pour séparer plusieurs spécialités demandées.)</span>
                  <textarea name="specialites" required className="input h-24 transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2) user-invalid:border-red-500 user-invalid:ring-red-500 user-invalid:outline-red-500 mt-2" 
                    value={formData.specialites}
                    onChange={handleInputChange}
                  />
                </Field>

                <Field label="Pays demandés">
                  {/*<span className="text-xs text-col text-gray-400">(Veuillez utiliser une virgule " , " pour séparer plusieurs pays demandés.)</span>*/}
                  {/*<textarea name="pays_demandes" required className="input h-20 transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2) user-invalid:border-red-500 user-invalid:ring-red-500 user-invalid:outline-red-500" 
                    value={formData.pays_demandes}
                    onChange={handleInputChange}
                  />*/}
                  <span className="text-xs text-col text-slate-500">Vous pouvez sélectionner plusieurs pays</span>
                  <div className="relative">
                    <div 
                      className="input min-h-12.5 flex flex-wrap gap-2 p-2 cursor-text border transition-all outline-(--color-theme-green) focus-within:border-(--color-theme-blue2) focus-within:ring-1 focus-within:ring-(--color-theme-blue2)"
                      onClick={() => setIsDropdownOpen(true)}
                    >
                      {selectedPays.map((pays, i) => {
                        //const isDefaultPays = pays === defaultPaysDemande?.pays;
                        const isDefaultPays = defaultPays !== "" && pays === defaultPays;

                        return (
                          <div 
                            key={i}
                            className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm animate-in fade-in zoom-in duration-200 border ${
                              isDefaultPays 
                                ? "bg-(--color-theme-green) border-(--color-theme-green) text-white"
                                : "bg-blue-50 border-(--color-theme-green) text-(--color-theme-green)"
                            }`}
                          >
                            <span className="font-medium">{pays}</span>
                            {!isDefaultPays && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  togglePays(pays);
                                }}
                                className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                      
                      <input
                        type="text"
                        className="flex-1 min-w-37.5 outline-none bg-transparent text-sm h-8"
                        placeholder={selectedPays.length === 0 ? "Rechercher un pays..." : ""}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setIsDropdownOpen(true)}
                      />
                    </div>

                    {/* Liste déroulante avec Checkboxes */}
                    {isDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                        
                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto animate-in slide-in-from-top-2 duration-200">
                          {filteredPays.length > 0 ? (
                            filteredPays.map((pays) => {
                              //const isDefaultPays = pays === defaultPaysDemande?.pays;
                              const isDefaultPays = defaultPays !== "" && pays === defaultPays;

                              return (
                                <label 
                                  key={pays} 
                                  className={`flex items-center px-4 py-2.5 transition-colors border-b last:border-0 border-gray-100 ${
                                    isDefaultPays 
                                      ? "bg-error-500/20 cursor-not-allowed"
                                      : "hover:bg-gray-50 cursor-pointer"
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    // Désactivé si c'est le pays initial
                                    disabled={isDefaultPays}
                                    className="w-4 h-4 rounded border-gray-300 text-(--color-theme-green) focus:ring-(--color-theme-green) mr-3 disabled:opacity-60 disabled:cursor-not-allowed"
                                    // Toujours coché si c'est le pays initial, sinon vérifie selectedPays
                                    checked={isDefaultPays || selectedPays.includes(pays)}
                                    onChange={() => !isDefaultPays && togglePays(pays)}
                                  />
                                  <div className="flex flex-col">
                                    <span className={`text-sm ${
                                      isDefaultPays 
                                        ? 'font-bold text-amber-700' 
                                        : selectedPays.includes(pays) ? 'font-semibold text-(--color-theme-green)' : 'text-gray-700'
                                    }`}>
                                      {pays}
                                    </span>
                                    {isDefaultPays && (
                                      <span className="text-[12px] text-(color-theme-dark-blue) font-medium">Pays d’accueil correspondant à l’offre de bourses à laquelle vous avez postulé</span>
                                    )}
                                  </div>
                                </label>
                              );
                            })
                          ) : (
                            <div className="p-4 text-sm text-gray-500 text-center italic">Aucun pays trouvé</div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Input caché pour la validation "required" du formulaire HTML classique */}
                  <input 
                    type="hidden" 
                    name="pays_demandes" 
                    value={formData.pays_demandes} 
                    required 
                  />
                </Field>
              </div>

              <div className="p-5 border border-slate-400 rounded-lg">
                <h4 className="mb-1 font-semibold text-(--color-theme-green)">Institution ou organisme d'accueil sollicité :</h4>
                <span className="text-xs text-slate-500">(Indiquer le cas échéant les contacts déjà pris et joindre éventuellement la lettre d'accueil)</span>
                
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4 mt-4">
                    <Field label="Institution ou organisme d'accueil sollicité">
                        <input type="text" name="organisme_sollicite" required className="input transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2) user-invalid:border-red-500 user-invalid:ring-red-500 user-invalid:outline-red-500" 
                            value={formData.organisme_sollicite}
                            onChange={handleInputChange}
                        />
                    </Field>

                    <Field label="Contacts de l'institution ou de l'organisme" isRequired={false}>
                        <span className="text-xs text-slate-500">(Mentionnez le nom et l'adresse email du responsable que vous avez déjà contacté)</span>
                        <input type="text" name="organisme_detail_contact" className="input transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2) user-invalid:border-red-500 user-invalid:ring-red-500 user-invalid:outline-red-500" 
                            value={formData.organisme_detail_contact}
                            onChange={handleInputChange}
                        />
                    </Field>

                    <Field
                        label="Lettre d'accueil" isRequired={false}
                        className="transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2)"
                        >
                        <span className="text-xs text-slate-500">(Veuillez joindre la lettre d'accueil officielle ou l'attestation d'admission si vous avez déjà été accepté par l'institution ou l'organisme d'accueil.)</span>
                        <label className="block w-full cursor-pointer">
                            <FileInput
                            name="organisme_lettre_accueil"
                            multiple={false}
                            file={files["organisme_lettre_accueil"]}
                            onChange={(file) =>
                                setFiles({ ...files, organisme_lettre_accueil: file })
                            }
                            />
                        </label>
                    </Field>
                </div>
              </div>

              <div className="p-5 border border-slate-400 rounded-lg">
                <h4 className="mb-5 font-semibold text-(--color-theme-green)">Le candidat a-t-il déposé d'autre demande de bourses auprès des organismes nationaux ou étrangers ?</h4>
                
                <div className="mb-10">
                    <div className="grid grid-cols-1"></div>
                        <div className="flex items-center pb-4">
                            {/* OUI */}
                            <label className="inline-flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="autre_depot_externe"
                                value="true"
                                checked={formData.autre_depot_externe === true}
                                onChange={() =>
                                setFormData((prev) => ({
                                    ...prev,
                                    autre_depot_externe: true,
                                }))
                                }
                                className="h-4 w-4 text-(--color-theme-green) focus:ring-(--color-theme-blue2)"
                            />
                            <span className="text-gray-700"><strong>OUI</strong>, j’ai déposé une autre demande de bourse auprès d’un autre organisme.</span>
                            </label>
                        </div>

                        <div className="flex items-center">
                            {/* NON */}
                            <label className="inline-flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="autre_depot_externe"
                                value="false"
                                checked={formData.autre_depot_externe === false}
                                onChange={() =>
                                setFormData((prev) => ({
                                    ...prev,
                                    autre_depot_externe: false,
                                }))
                                }
                                className="h-4 w-4 text-(--color-theme-green) focus:ring-(--color-theme-blue2)"
                            />
                            <span className=" text-gray-700"><strong>NON</strong>, je n’ai effectué aucune autre demande de bourse.</span>
                            </label>
                        </div>
                    </div>

                    {formData.autre_depot_externe && (
                      <div className="mt-4 space-y-6 animate-in fade-in slide-in-from-top-2 duration-400">
                          <span className="font-semibold">Si OUI, préciser le nombre de bourses, la nature de la bourse, la spécialité, l'organisme sollicité et la date du départ.</span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-4">
                            <Field label="Nombre de demandes déjà déposées" isRequired={true}>
                                <input 
                                    type="number" 
                                    min={0} 
                                    name="nombre_depot_externe" 
                                    className="input transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2) user-invalid:border-red-500 user-invalid:ring-red-500 user-invalid:outline-red-500" 
                                    value={formData.nombre_depot_externe}
                                    onChange={handleNombreChange} 
                                />
                            </Field>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4 mt-4">
                            {formData.depots_externes.map((depot, index) => (
                                <div key={index} className="p-4 border rounded-lg bg-gray-50 space-y-4 animate-in fade-in slide-in-from-top-2">
                                    <h4 className="font-bold text-blue-600">
                                      Demande de bourse {formData.depots_externes.length > 1 ? ` - n° ${index + 1}` : ""}
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Field label="Nature de la bourse" isRequired={true}>
                                            <input 
                                                type="text" 
                                                className="input transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2) user-invalid:border-red-500 user-invalid:ring-red-500 user-invalid:outline-red-500"
                                                value={depot.nature_bourse}
                                                onChange={(e) => handleDepotFieldChange(index, 'nature_bourse', e.target.value)}
                                            />
                                        </Field>
                                        <Field label="Spécialité" isRequired={true}>
                                            <input 
                                                type="text" 
                                                className="input transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2) user-invalid:border-red-500 user-invalid:ring-red-500 user-invalid:outline-red-500"
                                                value={depot.specialite}
                                                onChange={(e) => handleDepotFieldChange(index, 'specialite', e.target.value)}
                                            />
                                        </Field>
                                        <Field label="Organisme sollicité" isRequired={true}>
                                            <input 
                                                type="text" 
                                                className="input transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2) user-invalid:border-red-500 user-invalid:ring-red-500 user-invalid:outline-red-500"
                                                value={depot.organisme_sollicite}
                                                onChange={(e) => handleDepotFieldChange(index, 'organisme_sollicite', e.target.value)}
                                            />
                                        </Field>
                                        <Field label="Date du départ" isRequired={true}>
                                            <input 
                                                type="date" 
                                                className="input transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2) user-invalid:border-red-500 user-invalid:ring-red-500 user-invalid:outline-red-500"
                                                value={depot.date_depart}
                                                onChange={(e) => handleDepotFieldChange(index, 'date_depart', e.target.value)}
                                            />
                                        </Field>
                                    </div>
                                </div>
                            ))}
                          </div>
                      </div>
                    )}

              </div>

            </fieldset>

            {/* ACTIONS / NAVIGATION */}
            <div className="flex flex-wrap items-center justify-end gap-4 pt-10">
              <button type="button" 
              onClick={prevStep}  
              className="inline-flex gap-3 bg-(--color-theme-green) text-white px-8 py-3 rounded-lg hover:bg-(--color-theme-yellow) hover:text-(--color-theme-dark-blue) disabled:opacity-50 transition">
                <ArrowLeft className="w-5 h-5" />
                Précédent
              </button>

              <button type="button" 
              onClick={() => {
                if (validateStep()) {
                  nextStep()
                } else {
                  formRef.current?.reportValidity()
                }
              }}
              className="inline-flex gap-3 bg-(--color-theme-green) text-white px-8 py-3 rounded-lg hover:bg-(--color-theme-yellow) hover:text-(--color-theme-dark-blue) disabled:opacity-50 transition">
                Suivant
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      

      {/* ETAPE 4 */}
      {/* ===================== PIECES JOINTES ===================== */}
      
        {currentStep === 4 && (
          <motion.div
            variants={stepVariants}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.35 }}
          >
            <div className="flex items-center justify-center text-center my-6 bg-amber-100 border border-(--color-theme-yellow) rounded-lg p-6 mb-6">
              <p className="w-150 text-sm text-col text-(--color-theme-dark-blue)">
                <TriangleAlert size={18}/>
                Important : Toutes les pièces jointes doivent être des copies certifiées conformes aux originaux ou légalisées par les autorités compétentes.<br/> 
                Toute pièce non conforme sera rejetée.
                </p>
            </div>

            <fieldset className="border border-(--color-theme-green) rounded-lg p-6 space-y-6">
              <legend className="font-semibold text-xl px-2 text-(--color-theme-blue2)">
                Pièces jointes
              </legend>
              <p className="text-sm text-col text-(--color-theme-red) mb-5">Formats acceptés : <strong>PDF, JPG, JPEG, PNG</strong></p>

              {[
                "Copie du dernier diplôme obtenu (ou Attestation de réussite) ",
                "Relevé de notes des 3 dernières années",
                "Copie légalisée du diplôme de baccalauréat",
                "Copie d'acte de naissance",
                "Certificat de nationalité",
                "Copie certifiée conforme du passeport",
                "Casier judiciaire",
                "Photo d'identité récente",
                "Certificat médical",
              ].map((label, index) => {
                const name = `piece_${index}`
                const isMultiple = label === "Relevé de notes des 3 dernières années";
                //const currentFileValue = files[name];
                const currentFiles = files[name] || [];

                return (
                  <Field key={index} label={label} className="transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2) user-invalid:border-red-500 user-invalid:ring-red-500 user-invalid:outline-red-500">
                    {label === "Relevé de notes des 3 dernières années" && (
                      <div className="text-xs text-slate-500">
                        Veuillez joindre un relevé de notes par année d’étude. Plusieurs fichiers peuvent être ajoutés ici.
                      </div>
                    )}
                    <label className="block w-full cursor-pointer ">
                      <FileInput
                        name={name}
                        required
                        multiple={isMultiple}
                        file={currentFiles}
                        hasSubmitted={hasSubmitted}
                        onChange={(val) => {
                          //setFiles({ ...files, [name]: file })
                          if (isMultiple) {
                            const newFilesArray = Array.isArray(val) ? val : [];
                            
                            // FUSION : on garde les anciens et on ajoute les nouveaux
                            // Optionnel : filtrer les doublons par nom
                            setFiles((prev) => {
                              const oldFiles = Array.isArray(prev[name]) ? prev[name] : [];
                              return { ...prev, [name]: [...oldFiles, ...newFilesArray] };
                            });
                          } else {
                            setFiles({ ...files, [name]: val });
                          }
                        }}
                      />
                    </label>
                    {/* AFFICHAGE AMÉLIORÉ DE LA LISTE (Mode Multiple uniquement) */}
                      {isMultiple && Array.isArray(currentFiles) && currentFiles.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {currentFiles.map((f: File, i: number) => (
                            <div 
                              key={`${f.name}-${i}`}
                              className="flex items-center gap-2 bg-blue-50 border border-(--color-theme-green) text-(--color-theme-green) px-3 py-1.5 rounded-full text-sm animate-in fade-in zoom-in duration-200"
                            >
                              <span className="truncate max-w-50 font-medium">{f.name}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  // SUPPRESSION : on filtre pour garder tout sauf l'index actuel
                                  const updatedList = currentFiles.filter((_, indexFilter) => indexFilter !== i);
                                  setFiles({ ...files, [name]: updatedList });
                                }}
                                className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                                title="Supprimer ce fichier"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                  </Field>
                )
              })}

              {/* AUTRES PIECES JOINTES */}
              {autresPieces.map((id) => {
                const name = `autre_piece_${id}`

                return (
                  <Field key={id} label="Autre pièce jointe" className="transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2)">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <label className="block w-full cursor-pointer ">
                          <FileInput
                            name={name}
                            multiple={false}
                            file={files[name]}
                            hasSubmitted={hasSubmitted}
                            onChange={(file) =>
                              setFiles({ ...files, [name]: file })
                            }
                          />
                        </label>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setAutresPieces(autresPieces.filter((x) => x !== id))
                          const copy = { ...files }
                          delete copy[name]
                          setFiles(copy)
                        }}
                        className="inline-flex gap-2 rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 transition"
                      >
                        <X className="w-5 h-5" /> Supprimer
                      </button>
                    </div>
                  </Field>
                )
              })}


              {/* BOUTONS ACTIONS */}
              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setAutresPieces([...autresPieces, Date.now()])}
                  className="inline-flex gap-3 items-center rounded-md bg-(--color-theme-green) px-5 py-2 text-sm font-medium text-white hover:bg-(--color-theme-yellow) hover:text-(--color-theme-dark-blue) transition"
                >
                  <FilePlus className="w-5 h-5" /> Ajouter une autre pièce jointe
                </button>

              </div>
            </fieldset>

            {/* ACTIONS / NAVIGATION */}
            <div className="flex flex-wrap items-center justify-end gap-4 pt-10">
              <button type="button" 
              onClick={prevStep}  
              className="inline-flex gap-3 bg-(--color-theme-green) text-white px-8 py-3 rounded-lg hover:bg-(--color-theme-yellow) hover:text-(--color-theme-dark-blue) disabled:opacity-50 transition">
                <ArrowLeft className="w-5 h-5" />
                Précédent
              </button>

              <button type="button" 
              onClick={() => {
                setHasSubmitted(true);
                if (validateStep()) {
                  nextStep();
                } else {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="inline-flex gap-3 bg-(--color-theme-green) text-white px-8 py-3 rounded-lg hover:bg-(--color-theme-yellow) hover:text-(--color-theme-dark-blue) disabled:opacity-50 transition">
                Suivant
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

      {/* ETAPE 5 */}
      {/* ===================== AUTHENTIFICATION LOGIN / CREATION DE COMPTE ===================== */}
      
        {currentStep === 5 && (
          <motion.div
            variants={stepVariants}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.35 }}
          >
            {/* ===================== SE CONNECTER ===================== */}
            {user ? (
              /* TEXTE SI CONNECTÉ */
              <div className="text-sm text-slate-600 bg-slate-50 border border-slate-200 px-6 py-10 rounded-xl inline-block">
                  <p className="mb-5">
                      Vous êtes maintenant connecté en tant que : <span className="font-bold text-(--color-theme-green)">{user.email}</span>
                  </p>
                  <p>
                      Si ce n'est pas vous, merci de vous deconnecter et connecter votre compte pour une meilleur suivi de votre candidature.
                      <button 
                          onClick={logoutInForm} 
                          className="ml-4 text-red-500 hover:text-red-700 font-bold underline underline-offset-4 transition-all"
                      >
                          Se déconnecter
                      </button>
                  </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-center text-center my-6 bg-amber-100 border border-(--color-theme-yellow) rounded-lg p-6">
                  <p className="w-150 text-sm text-col text-(--color-theme-dark-blue)">Veuillez vous connecter à votre compte afin de finaliser votre demande de candidature aux bourses d’études extérieurs.</p>
                </div>

                <div className="text-center">
                  <button type="button" 
                    onClick={() => setIsLoginOpen(true)}
                    className="inline-flex gap-3 bg-(--color-theme-green) text-white px-8 py-3 rounded-lg hover:bg-(--color-theme-yellow) hover:text-(--color-theme-dark-blue) disabled:opacity-50 transition">
                    <UserLock className="w-5 h-5"/>
                    Se connecter à mon compte
                  </button>
                  <div className="text-xs text-slate-500 mt-2">* Si vous avez déja un compte utilisateur.</div>
                </div>

                <div className="flex items-center justify-center my-6">
                  <div className="flex items-center justify-center w-15 h-15 rounded-full bg-(--color-theme-yellow) text-(--color-theme-dark-blue) font-bold shadow-sm">
                    ou
                  </div>
                </div>

                {/* ===================== CREER UN COMPTE UTILISATEUR ===================== */}
                <fieldset className="border border-(--color-theme-green) rounded-lg p-6">
                  <legend className="font-semibold text-xl px-2 mx-auto text-center text-(--color-theme-blue2)">
                    Créer un nouveau compte utilisateur
                  </legend>

                  <span className="text-xs text-slate-500">Ce compte vous permet de consulter les dossiers de candidature que vous avez déjà déposés, ainsi que leur détail respectif.</span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-4">
                    <Field label="Nom">
                      <input type="text" name="new_login_nom" required className="input transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2) user-invalid:border-red-500 user-invalid:ring-red-500 user-invalid:outline-red-500" 
                        value={formData.new_login_nom}
                        onChange={handleInputChange}
                      />
                    </Field>

                    <Field label="Prénom">
                      <input type="text" name="new_login_prenom" required className="input transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2) user-invalid:border-red-500 user-invalid:ring-red-500 user-invalid:outline-red-500" 
                        value={formData.new_login_prenom}
                        onChange={handleInputChange}
                      />
                    </Field>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-4">
                    <Field label="Adresse email">
                      <input type="email" name="new_login_email" required className="input transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2) user-invalid:border-red-500 user-invalid:ring-red-500 user-invalid:outline-red-500"
                        value={formData.new_login_email} 
                        onChange={handleInputChange}
                      />
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-4">
                    <div>
                      <Field label="Mot de passe">
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="new_login_password"
                            required
                            value={formData.new_login_password}
                            onChange={handleInputChange}
                            className="input pr-10 transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2) user-invalid:border-red-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-(--color-theme-green)"
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        <span className="text-xs text-slate-500">(Votre mot de passe doit contenir au moins : 6 caractères, 1 chiffre, 1 majuscule)</span>
                      </Field>

                      {/* Indicateur de force du mot de passe */}
                      {formData.new_login_password && (
                        <div className="mt-2 space-y-1">
                          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-500 ${
                                getPasswordStrength(formData.new_login_password) <= 1 ? 'bg-red-500' :
                                getPasswordStrength(formData.new_login_password) <= 4 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${(getPasswordStrength(formData.new_login_password) / 5) * 100}%` }}
                            />
                          </div>
                          <p className="text-[10px] text-gray-500 text-right italic">
                            {getPasswordStrength(formData.new_login_password) <= 1 ? 'Faible' :
                            getPasswordStrength(formData.new_login_password) <= 4 ? 'Moyen' : 'Fort'}
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <Field label="Confirmation du mot de passe">
                        <div className="relative">
                          <input
                            type={showConfirmation ? "text" : "password"}
                            name="new_login_confirmation"
                            required
                            value={formData.new_login_confirmation}
                            onChange={handleInputChange}
                            className={`input pr-10 transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2) ${
                              formData.new_login_confirmation && formData.new_login_confirmation !== formData.new_login_password 
                              ? 'border-red-500 ring-red-500 outline-red-500' 
                              : ''
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmation(!showConfirmation)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-(--color-theme-green)"
                          >
                            {showConfirmation ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </Field>
                      
                      {formData.new_login_confirmation && formData.new_login_confirmation !== formData.new_login_password && (
                        <p className="text-xs text-red-500 mt-2 italic animate-in fade-in slide-in-from-top-1">
                          Le mot de passe et le mot de passe de confirmation ne correspondent pas.
                        </p>
                      )}
                      
                      {formData.new_login_confirmation && formData.new_login_confirmation === formData.new_login_password && (
                        <p className="text-xs text-green-700 mt-2 italic animate-in fade-in">
                          Mot de passe confirmé.
                        </p>
                      )}
                    </div>

                  </div>
                </fieldset>
              </div>
            )}

            {/* ACTIONS / NAVIGATION */}
            <div className="flex flex-wrap items-center justify-end gap-4 pt-10">
              <button type="button" 
              onClick={prevStep}
              className="inline-flex gap-3 bg-(--color-theme-green) text-white px-8 py-3 rounded-lg hover:bg-(--color-theme-yellow) hover:text-(--color-theme-dark-blue) disabled:opacity-50 transition">
                <ArrowLeft className="w-5 h-5" />
                Précédent
              </button>

              <button type="button" onClick={nextStep} className="inline-flex gap-3 bg-gray-200 text-gray-400 cursor-not-allowed px-8 py-3 rounded-lg" disabled>
                Suivant
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* ===================== SUBMIT ===================== */}
            <div className="flex flex-wrap items-center justify-end gap-4 pt-10 text-(--color-theme-green)">
              En cliquant sur "Soumettre la candidature" vous déclarez sur l'honneur que les renseignements ci-dessous sont sincères et complets.
            </div>
            <div className="flex flex-wrap items-center justify-end gap-4 pt-5">
              <button
                type="button" onClick={handleReset}
                className="inline-flex gap-3 bg-gray-200 text-gray-700 px-8 py-3 rounded-lg hover:bg-(--color-theme-grey) hover:text-white disabled:opacity-50 transition"
              >
                <RotateCcw className="w-5 h-5" />
                Réinitialiser
              </button>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex gap-3 bg-(--color-theme-green) text-white px-8 py-3 rounded-lg hover:bg-(--color-theme-yellow) hover:text-(--color-theme-dark-blue) disabled:opacity-50 transition"
              >
                <Send className="w-5 h-5" />
                {loading ? "Envoi en cours..." : "Soumettre la candidature"}
              </button>
            </div>
          </motion.div>
        )}
    </form>
    
    <AlertModal
      open={modal.open}
      type={modal.type}
      title={modal.title}
      message={modal.message}
      /*onClose={() => setModal({ ...modal, open: false })}*/
      onClose={() => {
        if (modal.onClose) {
          modal.onClose();
        }
        setModal(prev => ({ ...prev, open: false }));
      }}
    />

    {isLoginOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsLoginOpen(false)}>
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
          
          <div className="p-6 border-b border-slate-300 flex justify-between items-center">
            <h3 className="text-lg font-bold text-(--color-theme-green)">Connectez-vous à votre compte</h3>
            <button onClick={() => setIsLoginOpen(false)} className="text-gray-400 hover:text-red-500 transition">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
            <Field label="Adresse email">
              <input type="email" name="authentification_email" required className="input text-(--color-theme-blue2) transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2) user-invalid:border-red-500 user-invalid:ring-red-500 user-invalid:outline-red-500" />
            </Field>

            <Field label="Mot de passe">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="authentification_password"
                  required
                  className="input text-(--color-theme-blue2) pr-10 transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2) user-invalid:border-red-500 user-invalid:ring-red-500 user-invalid:outline-red-500"
                />
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-(--color-theme-green)"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </Field>

            <button type="submit" className="w-full inline-flex items-center justify-center mt-5 gap-3 bg-(--color-theme-green) text-white px-8 py-3 rounded-lg hover:bg-(--color-theme-yellow) hover:text-(--color-theme-dark-blue) disabled:opacity-50 transition">
              Se connecter
              <LogIn className="w-5 h-5" />
            </button>
          </form>

        </div>
      </div>
    )}

  </div>
  )
}

function Field({ 
  label, 
  children, 
  showLabel = true, 
  isRequired = true, 
  className = "" 
}: { 
  label: string; 
  children: React.ReactNode; 
  showLabel?: boolean;
  isRequired?: boolean;
  className?: string; }) {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className={`block text-sm font-medium mb-1 text-(--color-theme-blue2) ${showLabel}`}>
        {label}
        {isRequired ? (
          <span className="text-red-500" aria-hidden="true"> *</span>
        ) : (
          <span className="text-gray-400 font-normal text-xs ml-1"> (optionnel)</span>
        )}
      </label>
      {children}
    </div>
  )
}

function FileInput({
  name,
  required = false,
  multiple,
  file,
  hasSubmitted,
  onChange,
}: {
  name: string
  required?: boolean
  multiple?: boolean
  file?: File | File[] | null
  hasSubmitted?: boolean;
  onChange: (file: any | File | File[] | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Réinitialiser quand la prop file devient null
  useEffect(() => {
    if ((!file || (Array.isArray(file) && file.length === 0)) && inputRef.current) {
      inputRef.current.value = '';
    }
  }, [file]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (multiple) {
      const selectedFiles = e.target.files;
      if (selectedFiles && selectedFiles.length > 0) {
        onChange(Array.from(selectedFiles));
      } else {
        onChange([]);
      }
    } else {
      const selectedFile = e.target.files?.[0] || null;
      onChange(selectedFile);
    }
  };
  
  // Logique pour déterminer le texte à afficher
  const getDisplayName = () => {
    if (!file) return "Aucun fichier sélectionné";
    
    if (Array.isArray(file)) {
      return file.length > 1 
        ? `${file.length} fichiers sélectionnés` 
        : file[0]?.name;
    }
    
    return (file as File).name;
  };

  const isInvalid = required && hasSubmitted && (!file || (Array.isArray(file) && file.length === 0));

  return (
    <div className="relative">
      {/* Faux input */}
      <div className={`input flex items-center justify-between pr-2 ${isInvalid ? 'border-red-500' : ''}`}>
        <span className="text-sm text-gray-500 truncate">
          {getDisplayName()}
        </span>

        <label className="inline-flex gap-2 cursor-pointer ml-3 shrink-0 rounded-md bg-(--color-theme-green) px-3 py-1.5 text-xs font-medium text-white hover:bg-(--color-theme-yellow) hover:text-slate-700 transition">
          <Paperclip className="w-4 h-4" /> Joindre fichier
          <input
            type="file"
            ref={inputRef}
            name={name}
            //required={required}
            multiple={multiple}
            className="hidden"
            onChange={handleChange}
          />
        </label>
      </div>
      {isInvalid && (
        <p className="text-sm text-red-600 mt-1">
          Ce document est obligatoire. Merci de joindre le fichier correspondant.
        </p>
      )}
    </div>
  )
}

const getPasswordStrength = (password: string) => {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score = score+2;
  return score; // Retourne un score de 0 à 5
};
