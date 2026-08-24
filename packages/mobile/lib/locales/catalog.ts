/**
 * Catálogo de traduções da PetsLife.
 *
 * A chave é a frase em português de Portugal, tal como aparece no ecrã.
 * A ordem dos valores é sempre: [en, es, de, fr]
 *
 * Se faltar uma frase aqui, a app mostra o português — nunca um código.
 */
export const ORDER = ["en", "es", "de", "fr"] as const;

export const T: Record<string, readonly [string, string, string, string]> = {
  // ── Botões de adicionar ───────────────────────────────────────────────
  "+ Adicionar": ["+ Add", "+ Añadir", "+ Hinzufügen", "+ Ajouter"],
  "+ Adicionar animal": ["+ Add pet", "+ Añadir mascota", "+ Tier hinzufügen", "+ Ajouter un animal"],
  "+ Adicionar animal primeiro": ["+ Add a pet first", "+ Añade una mascota primero", "+ Zuerst ein Tier hinzufügen", "+ Ajoutez d'abord un animal"],
  "+ Adicionar consulta": ["+ Add appointment", "+ Añadir consulta", "+ Termin hinzufügen", "+ Ajouter un rendez-vous"],
  "+ Adicionar documento": ["+ Add document", "+ Añadir documento", "+ Dokument hinzufügen", "+ Ajouter un document"],
  "+ Adicionar receita": ["+ Add prescription", "+ Añadir receta", "+ Rezept hinzufügen", "+ Ajouter une ordonnance"],
  "+ Adicionar registo": ["+ Add record", "+ Añadir registro", "+ Eintrag hinzufügen", "+ Ajouter un enregistrement"],
  "+ Adicionar vacina": ["+ Add vaccine", "+ Añadir vacuna", "+ Impfung hinzufügen", "+ Ajouter un vaccin"],
  "+ Publicar Anúncio": ["+ Post listing", "+ Publicar anuncio", "+ Anzeige aufgeben", "+ Publier une annonce"],
  "+ Registar Negócio": ["+ Register business", "+ Registrar negocio", "+ Unternehmen anmelden", "+ Enregistrer une entreprise"],

  // ── Estados de carregamento ───────────────────────────────────────────
  "A carregar foto...": ["Uploading photo...", "Subiendo foto...", "Foto wird hochgeladen...", "Envoi de la photo..."],
  "A carregar foto... 📤": ["Uploading photo... 📤", "Subiendo foto... 📤", "Foto wird hochgeladen... 📤", "Envoi de la photo... 📤"],
  "A carregar...": ["Loading...", "Cargando...", "Wird geladen...", "Chargement..."],
  "A carregar... 📤": ["Loading... 📤", "Cargando... 📤", "Wird geladen... 📤", "Chargement... 📤"],
  "A fazer upload...": ["Uploading...", "Subiendo...", "Wird hochgeladen...", "Téléversement..."],
  "🐾 A carregar...": ["🐾 Loading...", "🐾 Cargando...", "🐾 Wird geladen...", "🐾 Chargement..."],
  "Só um instante, quase lá...": ["Just a moment, almost there...", "Un momento, ya casi...", "Einen Moment, fast geschafft...", "Un instant, presque fini..."],

  // ── Validações e mensagens ────────────────────────────────────────────
  "A descrição é obrigatória.": ["Description is required.", "La descripción es obligatoria.", "Beschreibung ist erforderlich.", "La description est obligatoire."],
  "A password deve ter pelo menos 8 caracteres.": ["Password must be at least 8 characters.", "La contraseña debe tener al menos 8 caracteres.", "Das Passwort muss mindestens 8 Zeichen haben.", "Le mot de passe doit contenir au moins 8 caractères."],
  "Campo obrigatório": ["Required field", "Campo obligatorio", "Pflichtfeld", "Champ obligatoire"],
  "Campos obrigatórios": ["Required fields", "Campos obligatorios", "Pflichtfelder", "Champs obligatoires"],
  "O nome é obrigatório.": ["Name is required.", "El nombre es obligatorio.", "Der Name ist erforderlich.", "Le nom est obligatoire."],
  "O título é obrigatório.": ["Title is required.", "El título es obligatorio.", "Der Titel ist erforderlich.", "Le titre est obligatoire."],
  "Nome é obrigatório": ["Name is required", "El nombre es obligatorio", "Name ist erforderlich", "Le nom est obligatoire"],
  "Título é obrigatório": ["Title is required", "El título es obligatorio", "Titel ist erforderlich", "Le titre est obligatoire"],
  "Motivo é obrigatório": ["Reason is required", "El motivo es obligatorio", "Grund ist erforderlich", "Le motif est obligatoire"],
  "Produto é obrigatório": ["Product is required", "El producto es obligatorio", "Produkt ist erforderlich", "Le produit est obligatoire"],
  "Preencha todos os campos.": ["Please fill in all fields.", "Rellene todos los campos.", "Bitte alle Felder ausfüllen.", "Veuillez remplir tous les champs."],
  "Por favor preencha a data e hora.": ["Please fill in the date and time.", "Rellene la fecha y la hora.", "Bitte Datum und Uhrzeit ausfüllen.", "Veuillez indiquer la date et l'heure."],
  "Insere um peso válido em kg": ["Enter a valid weight in kg", "Introduce un peso válido en kg", "Gültiges Gewicht in kg eingeben", "Saisissez un poids valide en kg"],
  "Insira um peso válido": ["Enter a valid weight", "Introduzca un peso válido", "Gültiges Gewicht eingeben", "Saisissez un poids valide"],
  "Insira a data da consulta.": ["Enter the appointment date.", "Introduzca la fecha de la consulta.", "Termindatum eingeben.", "Saisissez la date du rendez-vous."],
  "Insira o motivo da consulta.": ["Enter the reason for the appointment.", "Introduzca el motivo de la consulta.", "Grund für den Termin eingeben.", "Saisissez le motif du rendez-vous."],
  "Insira o nome da vacina.": ["Enter the vaccine name.", "Introduzca el nombre de la vacuna.", "Impfstoffnamen eingeben.", "Saisissez le nom du vaccin."],
  "Insira o título do documento.": ["Enter the document title.", "Introduzca el título del documento.", "Dokumenttitel eingeben.", "Saisissez le titre du document."],
  "Insira um título para o registo.": ["Enter a title for the record.", "Introduzca un título para el registro.", "Titel für den Eintrag eingeben.", "Saisissez un titre pour l'enregistrement."],
  "Escreva um título para a missão.": ["Write a title for the mission.", "Escriba un título para la misión.", "Titel für die Mission eingeben.", "Écrivez un titre pour la mission."],
  "Escreve o nome da medicação ou tratamento.": ["Enter the medication or treatment name.", "Escribe el nombre de la medicación o tratamiento.", "Namen des Medikaments oder der Behandlung eingeben.", "Saisissez le nom du médicament ou du traitement."],
  "Escreve o nome do parceiro.": ["Enter the partner's name.", "Escribe el nombre del socio.", "Namen des Partners eingeben.", "Saisissez le nom du partenaire."],
  "Introduz o teu email.": ["Enter your email.", "Introduce tu correo.", "Gib deine E-Mail ein.", "Saisissez votre e-mail."],
  "Introduz um código primeiro.": ["Enter a code first.", "Introduce un código primero.", "Zuerst einen Code eingeben.", "Saisissez d'abord un code."],
  "Falta o título": ["Title missing", "Falta el título", "Titel fehlt", "Titre manquant"],
  "Selecione um animal": ["Select a pet", "Seleccione una mascota", "Tier auswählen", "Sélectionnez un animal"],
  "Escolha a qual animal pertence esta consulta.": ["Choose which pet this appointment belongs to.", "Elija a qué mascota pertenece esta consulta.", "Wählen Sie, zu welchem Tier dieser Termin gehört.", "Choisissez à quel animal appartient ce rendez-vous."],
  "Escolha a qual animal pertence esta vacina.": ["Choose which pet this vaccine belongs to.", "Elija a qué mascota pertenece esta vacuna.", "Wählen Sie, zu welchem Tier diese Impfung gehört.", "Choisissez à quel animal appartient ce vaccin."],
  "Escolha a qual animal pertence este registo.": ["Choose which pet this record belongs to.", "Elija a qué mascota pertenece este registro.", "Wählen Sie, zu welchem Tier dieser Eintrag gehört.", "Choisissez à quel animal appartient cet enregistrement."],
  "Escolha a data da consulta (dia/mês/ano).": ["Choose the appointment date (day/month/year).", "Elija la fecha de la consulta (día/mes/año).", "Termindatum wählen (Tag/Monat/Jahr).", "Choisissez la date du rendez-vous (jour/mois/année)."],
  "Indique a data de início no formato dia/mês/ano.": ["Enter the start date as day/month/year.", "Indique la fecha de inicio en formato día/mes/año.", "Startdatum im Format Tag/Monat/Jahr angeben.", "Indiquez la date de début au format jour/mois/année."],
  "Hora em formato 24h — ex: 14:30": ["Time in 24h format — e.g. 14:30", "Hora en formato 24h — ej: 14:30", "Uhrzeit im 24-Stunden-Format — z. B. 14:30", "Heure au format 24 h — ex. : 14:30"],
  "Hora inválida. Use o formato HH:MM (ex: 14:30).": ["Invalid time. Use HH:MM format (e.g. 14:30).", "Hora no válida. Use el formato HH:MM (ej: 14:30).", "Ungültige Uhrzeit. Format HH:MM verwenden (z. B. 14:30).", "Heure invalide. Utilisez le format HH:MM (ex. : 14:30)."],
  "Ficheiro necessário": ["File required", "Archivo necesario", "Datei erforderlich", "Fichier requis"],
  "Por favor adicione uma foto ou ficheiro": ["Please add a photo or file", "Añada una foto o archivo", "Bitte ein Foto oder eine Datei hinzufügen", "Veuillez ajouter une photo ou un fichier"],
  "Por favor adicione uma foto ou ficheiro da receita": ["Please add a photo or file of the prescription", "Añada una foto o archivo de la receta", "Bitte ein Foto oder eine Datei des Rezepts hinzufügen", "Veuillez ajouter une photo ou un fichier de l'ordonnance"],
  "Por favor adicione uma foto ou ficheiro do documento.": ["Please add a photo or file of the document.", "Añada una foto o archivo del documento.", "Bitte ein Foto oder eine Datei des Dokuments hinzufügen.", "Veuillez ajouter une photo ou un fichier du document."],

  // ── Erros ─────────────────────────────────────────────────────────────
  "Erro": ["Error", "Error", "Fehler", "Erreur"],
  "Erro ao carregar foto": ["Error uploading photo", "Error al subir la foto", "Fehler beim Hochladen des Fotos", "Erreur lors de l'envoi de la photo"],
  "Erro ao carregar foto 😿": ["Error uploading photo 😿", "Error al subir la foto 😿", "Fehler beim Hochladen des Fotos 😿", "Erreur lors de l'envoi de la photo 😿"],
  "Erro ao entrar": ["Sign-in error", "Error al entrar", "Anmeldefehler", "Erreur de connexion"],
  "Erro ao escolher foto": ["Error choosing photo", "Error al elegir la foto", "Fehler beim Auswählen des Fotos", "Erreur lors du choix de la photo"],
  "Erro ao partilhar": ["Error sharing", "Error al compartir", "Fehler beim Teilen", "Erreur de partage"],
  "Erro no upload": ["Upload error", "Error de subida", "Upload-Fehler", "Erreur de téléversement"],
  "Atenção": ["Attention", "Atención", "Achtung", "Attention"],
  "Sem ligação": ["No connection", "Sin conexión", "Keine Verbindung", "Pas de connexion"],
  "Sem ligação ao servidor. Verifica o teu WiFi.": ["No connection to the server. Check your WiFi.", "Sin conexión al servidor. Comprueba tu WiFi.", "Keine Verbindung zum Server. Prüfe dein WLAN.", "Pas de connexion au serveur. Vérifiez votre WiFi."],
  "Não foi possível abrir a câmara.": ["Could not open the camera.", "No se pudo abrir la cámara.", "Kamera konnte nicht geöffnet werden.", "Impossible d'ouvrir l'appareil photo."],
  "Não foi possível abrir a galeria.": ["Could not open the gallery.", "No se pudo abrir la galería.", "Galerie konnte nicht geöffnet werden.", "Impossible d'ouvrir la galerie."],
  "Não foi possível abrir a política de privacidade.": ["Could not open the privacy policy.", "No se pudo abrir la política de privacidad.", "Datenschutzerklärung konnte nicht geöffnet werden.", "Impossible d'ouvrir la politique de confidentialité."],
  "Não foi possível abrir a videochamada.": ["Could not open the video call.", "No se pudo abrir la videollamada.", "Videoanruf konnte nicht geöffnet werden.", "Impossible d'ouvrir l'appel vidéo."],
  "Não foi possível abrir o Google Maps": ["Could not open Google Maps", "No se pudo abrir Google Maps", "Google Maps konnte nicht geöffnet werden", "Impossible d'ouvrir Google Maps"],
  "Não foi possível abrir o browser.": ["Could not open the browser.", "No se pudo abrir el navegador.", "Browser konnte nicht geöffnet werden.", "Impossible d'ouvrir le navigateur."],
  "Não foi possível abrir o email.": ["Could not open email.", "No se pudo abrir el correo.", "E-Mail konnte nicht geöffnet werden.", "Impossible d'ouvrir l'e-mail."],
  "Não foi possível agendar. Tente novamente.": ["Could not schedule. Please try again.", "No se pudo agendar. Inténtelo de nuevo.", "Terminbuchung fehlgeschlagen. Bitte erneut versuchen.", "Impossible de planifier. Réessayez."],
  "Não foi possível apagar. Tente outra vez.": ["Could not delete. Please try again.", "No se pudo eliminar. Inténtelo de nuevo.", "Löschen fehlgeschlagen. Bitte erneut versuchen.", "Impossible de supprimer. Réessayez."],
  "Não foi possível arquivar. Tente outra vez.": ["Could not archive. Please try again.", "No se pudo archivar. Inténtelo de nuevo.", "Archivieren fehlgeschlagen. Bitte erneut versuchen.", "Impossible d'archiver. Réessayez."],
  "Não foi possível eliminar a consulta.": ["Could not delete the appointment.", "No se pudo eliminar la consulta.", "Termin konnte nicht gelöscht werden.", "Impossible de supprimer le rendez-vous."],
  "Não foi possível enviar a mensagem": ["Could not send the message", "No se pudo enviar el mensaje", "Nachricht konnte nicht gesendet werden", "Impossible d'envoyer le message"],
  "Não foi possível fazer upload da foto.": ["Could not upload the photo.", "No se pudo subir la foto.", "Foto konnte nicht hochgeladen werden.", "Impossible d'envoyer la photo."],
  "Não foi possível guardar": ["Could not save", "No se pudo guardar", "Speichern fehlgeschlagen", "Impossible d'enregistrer"],
  "Não foi possível guardar as alterações.": ["Could not save the changes.", "No se pudieron guardar los cambios.", "Änderungen konnten nicht gespeichert werden.", "Impossible d'enregistrer les modifications."],
  "Não foi possível guardar o perfil.": ["Could not save the profile.", "No se pudo guardar el perfil.", "Profil konnte nicht gespeichert werden.", "Impossible d'enregistrer le profil."],
  "Não foi possível guardar. Tente outra vez com internet.": ["Could not save. Try again with an internet connection.", "No se pudo guardar. Inténtelo de nuevo con internet.", "Speichern fehlgeschlagen. Mit Internetverbindung erneut versuchen.", "Impossible d'enregistrer. Réessayez avec une connexion internet."],
  "Animal não encontrado": ["Pet not found", "Mascota no encontrada", "Tier nicht gefunden", "Animal introuvable"],
  "Consulta não encontrada.": ["Appointment not found.", "Consulta no encontrada.", "Termin nicht gefunden.", "Rendez-vous introuvable."],
  "Código inválido": ["Invalid code", "Código no válido", "Ungültiger Code", "Code invalide"],
  "Link de videochamada não disponível.": ["Video call link not available.", "Enlace de videollamada no disponible.", "Videoanruf-Link nicht verfügbar.", "Lien d'appel vidéo indisponible."],

  // ── Permissões ────────────────────────────────────────────────────────
  "Permissão necessária": ["Permission required", "Permiso necesario", "Berechtigung erforderlich", "Autorisation requise"],
  "Ative o acesso à câmara nas definições.": ["Enable camera access in settings.", "Active el acceso a la cámara en los ajustes.", "Kamerazugriff in den Einstellungen aktivieren.", "Activez l'accès à l'appareil photo dans les réglages."],
  "Ative o acesso à câmara.": ["Enable camera access.", "Active el acceso a la cámara.", "Kamerazugriff aktivieren.", "Activez l'accès à l'appareil photo."],
  "Ative o acesso à galeria.": ["Enable gallery access.", "Active el acceso a la galería.", "Galeriezugriff aktivieren.", "Activez l'accès à la galerie."],
  "Precisamos de acesso à câmara.": ["We need camera access.", "Necesitamos acceso a la cámara.", "Wir benötigen Kamerazugriff.", "Nous avons besoin de l'accès à l'appareil photo."],
  "Precisamos de acesso à galeria.": ["We need gallery access.", "Necesitamos acceso a la galería.", "Wir benötigen Galeriezugriff.", "Nous avons besoin de l'accès à la galerie."],
  "Permissões do browser": ["Browser permissions", "Permisos del navegador", "Browser-Berechtigungen", "Autorisations du navigateur"],

  // ── Fotos ─────────────────────────────────────────────────────────────
  "Adicionar foto": ["Add photo", "Añadir foto", "Foto hinzufügen", "Ajouter une photo"],
  "Adicionar fotos ao álbum 📸": ["Add photos to the album 📸", "Añadir fotos al álbum 📸", "Fotos zum Album hinzufügen 📸", "Ajouter des photos à l'album 📸"],
  "Alterar foto 📸": ["Change photo 📸", "Cambiar foto 📸", "Foto ändern 📸", "Changer la photo 📸"],
  "Nova foto": ["New photo", "Nueva foto", "Neues Foto", "Nouvelle photo"],
  "Foto de perfil": ["Profile photo", "Foto de perfil", "Profilfoto", "Photo de profil"],
  "Remover foto": ["Remove photo", "Quitar foto", "Foto entfernen", "Supprimer la photo"],
  "Eliminar foto?": ["Delete photo?", "¿Eliminar foto?", "Foto löschen?", "Supprimer la photo ?"],
  "Toque para alterar a foto": ["Tap to change the photo", "Toca para cambiar la foto", "Zum Ändern des Fotos tippen", "Touchez pour changer la photo"],
  "Tirar foto": ["Take photo", "Hacer foto", "Foto aufnehmen", "Prendre une photo"],
  "📷 Tirar foto": ["📷 Take photo", "📷 Hacer foto", "📷 Foto aufnehmen", "📷 Prendre une photo"],
  "📸 Tirar foto agora": ["📸 Take a photo now", "📸 Hacer una foto ahora", "📸 Jetzt Foto aufnehmen", "📸 Prendre une photo maintenant"],
  "Escolher da galeria": ["Choose from gallery", "Elegir de la galería", "Aus Galerie wählen", "Choisir dans la galerie"],
  "🖼️ Escolher da galeria": ["🖼️ Choose from gallery", "🖼️ Elegir de la galería", "🖼️ Aus Galerie wählen", "🖼️ Choisir dans la galerie"],
  "Escolher da galeria / ficheiros": ["Choose from gallery / files", "Elegir de la galería / archivos", "Aus Galerie / Dateien wählen", "Choisir dans la galerie / les fichiers"],
  "Escolher fotos da galeria": ["Choose photos from the gallery", "Elegir fotos de la galería", "Fotos aus der Galerie wählen", "Choisir des photos dans la galerie"],
  "Cortar uma foto antes de guardar": ["Crop a photo before saving", "Recortar una foto antes de guardar", "Foto vor dem Speichern zuschneiden", "Recadrer une photo avant d'enregistrer"],
  "Câmara": ["Camera", "Cámara", "Kamera", "Appareil photo"],
  "Câmara direta": ["Direct camera", "Cámara directa", "Direkte Kamera", "Appareil photo direct"],
  "Escolhe uma opção:": ["Choose an option:", "Elige una opción:", "Wähle eine Option:", "Choisissez une option :"],
  "Escolha a foto do": ["Choose the photo of", "Elige la foto de", "Wähle das Foto von", "Choisissez la photo de"],
  "Use a câmara para fotografar o documento": ["Use the camera to photograph the document", "Usa la cámara para fotografiar el documento", "Mit der Kamera das Dokument fotografieren", "Utilisez l'appareil photo pour photographier le document"],
  "Sem fotos ainda": ["No photos yet", "Todavía no hay fotos", "Noch keine Fotos", "Pas encore de photos"],
  "Álbum": ["Album", "Álbum", "Album", "Album"],
  "Álbum de Fotos 📸": ["Photo Album 📸", "Álbum de fotos 📸", "Fotoalbum 📸", "Album photo 📸"],
  "Álbum vazio": ["Album is empty", "Álbum vacío", "Album ist leer", "Album vide"],
  "As memórias dos teus animais": ["Your pets' memories", "Los recuerdos de tus mascotas", "Die Erinnerungen deiner Tiere", "Les souvenirs de vos animaux"],
  "Adiciona o teu primeiro animal para começar a criar memórias!": ["Add your first pet to start creating memories!", "¡Añade tu primera mascota para empezar a crear recuerdos!", "Füge dein erstes Tier hinzu und sammle Erinnerungen!", "Ajoutez votre premier animal pour commencer à créer des souvenirs !"],
  "Adicione fotos do seu animal para criar memórias especiais.": ["Add photos of your pet to create special memories.", "Añada fotos de su mascota para crear recuerdos especiales.", "Fügen Sie Fotos Ihres Tieres hinzu und schaffen Sie besondere Erinnerungen.", "Ajoutez des photos de votre animal pour créer des souvenirs."],
  "Partilhe momentos dos seus animais": ["Share moments of your pets", "Comparta momentos de sus mascotas", "Teilen Sie Momente Ihrer Tiere", "Partagez des moments avec vos animaux"],
  "Partilhe um momento com o seu animal... 🐾": ["Share a moment with your pet... 🐾", "Comparta un momento con su mascota... 🐾", "Teilen Sie einen Moment mit Ihrem Tier... 🐾", "Partagez un moment avec votre animal... 🐾"],
  "Partilhe um momento especial do seu animal": ["Share a special moment with your pet", "Comparta un momento especial de su mascota", "Teilen Sie einen besonderen Moment Ihres Tieres", "Partagez un moment spécial de votre animal"],
  "Seja o primeiro a partilhar!": ["Be the first to share!", "¡Sé el primero en compartir!", "Sei der Erste, der teilt!", "Soyez le premier à partager !"],

  // ── Saúde: consultas, vacinas, receitas, diário ───────────────────────
  ". Para urgências veterinárias, ligue para a clínica mais próxima ou dirija-se a uma clínica 24h.": [". For veterinary emergencies, call the nearest clinic or go to a 24h clinic.", ". Para urgencias veterinarias, llame a la clínica más cercana o acuda a una clínica 24h.", ". Bei tierärztlichen Notfällen rufen Sie die nächste Klinik an oder fahren Sie zu einer 24h-Klinik.", ". En cas d'urgence vétérinaire, appelez la clinique la plus proche ou rendez-vous dans une clinique 24h/24."],
  "3 dias grátis • Sem cartão": ["3 days free • No card needed", "3 días gratis • Sin tarjeta", "3 Tage gratis • Ohne Karte", "3 jours gratuits • Sans carte"],
  "A cada quantos dias?": ["Every how many days?", "¿Cada cuántos días?", "Alle wie viele Tage?", "Tous les combien de jours ?"],
  "A tua avaliação": ["Your rating", "Tu valoración", "Deine Bewertung", "Votre évaluation"],
  "A vida do seu animal, organizada.": ["Your pet's life, organised.", "La vida de su mascota, organizada.", "Das Leben Ihres Tieres, gut organisiert.", "La vie de votre animal, organisée."],
  "Acesso completo a todas as funcionalidades. Cancele quando quiser.": ["Full access to every feature. Cancel any time.", "Acceso completo a todas las funciones. Cancele cuando quiera.", "Voller Zugriff auf alle Funktionen. Jederzeit kündbar.", "Accès complet à toutes les fonctionnalités. Annulez quand vous voulez."],
  "Acesso rápido": ["Quick access", "Acceso rápido", "Schnellzugriff", "Accès rapide"],
  "Activar código": ["Activate code", "Activar código", "Code aktivieren", "Activer le code"],
  "Adicionar": ["Add", "Añadir", "Hinzufügen", "Ajouter"],
  "Adicionar Animal": ["Add Pet", "Añadir mascota", "Tier hinzufügen", "Ajouter un animal"],
  "Adicionar animal": ["Add pet", "Añadir mascota", "Tier hinzufügen", "Ajouter un animal"],
  "Adicionar outra hora": ["Add another time", "Añadir otra hora", "Weitere Uhrzeit hinzufügen", "Ajouter une autre heure"],
  "Adicione o seu primeiro animal": ["Add your first pet", "Añada su primera mascota", "Fügen Sie Ihr erstes Tier hinzu", "Ajoutez votre premier animal"],
  "Adicione um animal para gerir a sua saúde": ["Add a pet to manage its health", "Añada una mascota para gestionar su salud", "Fügen Sie ein Tier hinzu, um seine Gesundheit zu verwalten", "Ajoutez un animal pour gérer sa santé"],
  "Adicione um animal primeiro.": ["Add a pet first.", "Añada primero una mascota.", "Fügen Sie zuerst ein Tier hinzu.", "Ajoutez d'abord un animal."],
  "Adoção": ["Adoption", "Adopción", "Adoption", "Adoption"],
  "Agende a sua primeira consulta online com um veterinário.": ["Book your first online appointment with a vet.", "Reserve su primera consulta online con un veterinario.", "Buchen Sie Ihren ersten Online-Termin mit einer Tierärztin oder einem Tierarzt.", "Réservez votre première consultation en ligne avec un vétérinaire."],
  "Agende ou registe uma consulta": ["Book or record an appointment", "Reserve o registre una consulta", "Termin buchen oder eintragen", "Réservez ou enregistrez un rendez-vous"],
  "Agende, receba o link, partilhe com o vet e entre directamente aqui. Sem instalações.": ["Book it, get the link, share it with the vet and join right here. No installs.", "Reserve, reciba el enlace, compártalo con el veterinario y entre aquí mismo. Sin instalaciones.", "Termin buchen, Link erhalten, mit dem Tierarzt teilen und direkt hier beitreten. Ohne Installation.", "Réservez, recevez le lien, partagez-le avec le vétérinaire et rejoignez ici. Sans installation."],
  "Ainda não há comentários. Seja a primeira pessoa a comentar 🐾": ["No comments yet. Be the first to comment 🐾", "Todavía no hay comentarios. Sea la primera persona en comentar 🐾", "Noch keine Kommentare. Schreiben Sie den ersten 🐾", "Pas encore de commentaires. Soyez le premier à commenter 🐾"],
  "Ainda não há hotéis registados nesta área.": ["No hotels registered in this area yet.", "Todavía no hay hoteles registrados en esta zona.", "In diesem Gebiet sind noch keine Hotels eingetragen.", "Aucun hôtel enregistré dans cette zone pour le moment."],
  "Ainda não há missões": ["No missions yet", "Todavía no hay misiones", "Noch keine Missionen", "Pas encore de missions"],
  "Ainda não há serviços publicados nesta categoria.": ["No services posted in this category yet.", "Todavía no hay servicios publicados en esta categoría.", "In dieser Kategorie wurden noch keine Dienste eingestellt.", "Aucun service publié dans cette catégorie pour le moment."],
  "Ainda não há tosquiadores registados nesta área.": ["No groomers registered in this area yet.", "Todavía no hay peluqueros caninos registrados en esta zona.", "In diesem Gebiet sind noch keine Hundefriseure eingetragen.", "Aucun toiletteur enregistré dans cette zone pour le moment."],
  "Ainda não há treinadores registados nesta área.": ["No trainers registered in this area yet.", "Todavía no hay adiestradores registrados en esta zona.", "In diesem Gebiet sind noch keine Trainer eingetragen.", "Aucun éducateur enregistré dans cette zone pour le moment."],
  "Ainda não tens conversas": ["You have no conversations yet", "Todavía no tienes conversaciones", "Du hast noch keine Unterhaltungen", "Vous n'avez pas encore de conversations"],
  "Ainda sem avaliações. Sê o primeiro!": ["No reviews yet. Be the first!", "Todavía sin valoraciones. ¡Sé el primero!", "Noch keine Bewertungen. Sei der Erste!", "Pas encore d'avis. Soyez le premier !"],
  "Ajuda a encontrar animais perdidos": ["Help find lost pets", "Ayuda a encontrar mascotas perdidas", "Hilf, vermisste Tiere zu finden", "Aidez à retrouver les animaux perdus"],
  "Alergias, condições especiais...": ["Allergies, special conditions...", "Alergias, condiciones especiales...", "Allergien, besondere Umstände...", "Allergies, conditions particulières..."],
  "Animais à espera de um lar amoroso": ["Pets waiting for a loving home", "Mascotas esperando un hogar lleno de cariño", "Tiere, die auf ein liebevolles Zuhause warten", "Des animaux qui attendent un foyer aimant"],
  "Animal *": ["Pet *", "Mascota *", "Tier *", "Animal *"],
  "Animal Perdido": ["Lost Pet", "Mascota perdida", "Vermisstes Tier", "Animal perdu"],
  "Anúncio guardado. Será sincronizado em breve.": ["Listing saved. It will sync shortly.", "Anuncio guardado. Se sincronizará en breve.", "Anzeige gespeichert. Sie wird in Kürze synchronisiert.", "Annonce enregistrée. Elle sera synchronisée sous peu."],
  "Anúncios": ["Listings", "Anuncios", "Anzeigen", "Annonces"],
  "Apagar": ["Delete", "Eliminar", "Löschen", "Supprimer"],
  "Apagar comentário": ["Delete comment", "Eliminar comentario", "Kommentar löschen", "Supprimer le commentaire"],
  "Apagar conteúdo": ["Delete content", "Eliminar contenido", "Inhalt löschen", "Supprimer le contenu"],
  "Apagar código": ["Delete code", "Eliminar código", "Code löschen", "Supprimer le code"],
  "Apagar lembrete": ["Delete reminder", "Eliminar recordatorio", "Erinnerung löschen", "Supprimer le rappel"],
  "Apagar missão": ["Delete mission", "Eliminar misión", "Mission löschen", "Supprimer la mission"],
  "Apagar parceiro": ["Delete partner", "Eliminar socio", "Partner löschen", "Supprimer le partenaire"],
  "As notificações são geradas a partir dos dados de saúde dos teus animais 🐾": ["Notifications come from your pets' health data 🐾", "Las notificaciones se generan a partir de los datos de salud de tus mascotas 🐾", "Die Benachrichtigungen stammen aus den Gesundheitsdaten deiner Tiere 🐾", "Les notifications proviennent des données de santé de vos animaux 🐾"],
  "As tuas conversas com outros donos": ["Your chats with other owners", "Tus conversaciones con otros dueños", "Deine Gespräche mit anderen Haltern", "Vos conversations avec d'autres propriétaires"],
  "Caderneta / Comprovativo (foto ou PDF)": ["Record book / proof (photo or PDF)", "Cartilla / comprobante (foto o PDF)", "Impfpass / Nachweis (Foto oder PDF)", "Carnet / justificatif (photo ou PDF)"],
  "Carregue sempre em \"Permitir\" para a chamada funcionar correctamente.": ["Always tap \"Allow\" so the call works properly.", "Pulse siempre en \"Permitir\" para que la llamada funcione bien.", "Tippen Sie immer auf \"Erlauben\", damit der Anruf funktioniert.", "Appuyez toujours sur « Autoriser » pour que l'appel fonctionne."],
  "Clica no + para adicionar o primeiro peso": ["Tap + to add the first weight", "Pulsa + para añadir el primer peso", "Tippe auf +, um das erste Gewicht einzutragen", "Appuyez sur + pour ajouter le premier poids"],
  "Clínica": ["Clinic", "Clínica", "Klinik", "Clinique"],
  "Clínica / Hospital": ["Clinic / Hospital", "Clínica / Hospital", "Klinik / Tierklinik", "Clinique / Hôpital"],
  "Clínicas Veterinárias": ["Veterinary Clinics", "Clínicas veterinarias", "Tierarztpraxen", "Cliniques vétérinaires"],
  "Clínicas, lojas e serviços perto de si": ["Clinics, shops and services near you", "Clínicas, tiendas y servicios cerca de usted", "Kliniken, Läden und Dienste in Ihrer Nähe", "Cliniques, boutiques et services près de chez vous"],
  "Começar 3 dias grátis": ["Start 3 days free", "Empezar 3 días gratis", "3 Tage gratis starten", "Commencer 3 jours gratuits"],
  "Começar grátis": ["Start free", "Empezar gratis", "Gratis starten", "Commencer gratuitement"],
  "Como consultar o vet online": ["How to see the vet online", "Cómo consultar al veterinario online", "So sprechen Sie online mit dem Tierarzt", "Comment consulter le vétérinaire en ligne"],
  "Comprar online em lojas certificadas:": ["Buy online from certified shops:", "Comprar online en tiendas certificadas:", "Online bei zertifizierten Shops kaufen:", "Acheter en ligne dans des boutiques certifiées :"],
  "Comprovativo / Foto": ["Proof / Photo", "Comprobante / Foto", "Nachweis / Foto", "Justificatif / Photo"],
  "Confirme aqui e os avisos do QR code desse animal deixam de aparecer.": ["Confirm here and the QR code alerts for that pet will stop appearing.", "Confirme aquí y las alertas del código QR de esa mascota dejarán de aparecer.", "Bestätigen Sie hier und die QR-Code-Hinweise für dieses Tier verschwinden.", "Confirmez ici et les alertes du QR code de cet animal cesseront d'apparaître."],
  "Consulta actualizada com sucesso.": ["Appointment updated successfully.", "Consulta actualizada con éxito.", "Termin erfolgreich aktualisiert.", "Rendez-vous mis à jour avec succès."],
  "Consulta adicionada com sucesso.": ["Appointment added successfully.", "Consulta añadida con éxito.", "Termin erfolgreich hinzugefügt.", "Rendez-vous ajouté avec succès."],
  "Consulta online com o seu vet": ["Online appointment with your vet", "Consulta online con su veterinario", "Online-Sprechstunde mit Ihrem Tierarzt", "Consultation en ligne avec votre vétérinaire"],
  "Consultas em dia, bichinho a sorrir! 😸🐾": ["Check-ups up to date, happy pet! 😸🐾", "¡Consultas al día, mascota feliz! 😸🐾", "Termine erledigt, glückliches Tier! 😸🐾", "Rendez-vous à jour, animal heureux ! 😸🐾"],
  "Conta tudo sobre o teu bichinho... 🐾": ["Tell us all about your pet... 🐾", "Cuéntanos todo sobre tu mascota... 🐾", "Erzähl uns alles über dein Tier... 🐾", "Racontez tout sur votre animal... 🐾"],
  "Conte a história desta missão...": ["Tell the story of this mission...", "Cuente la historia de esta misión...", "Erzählen Sie die Geschichte dieser Mission...", "Racontez l'histoire de cette mission..."],
  "Conteúdo que os utilizadores assinalaram": ["Content flagged by users", "Contenido señalado por los usuarios", "Von Nutzern gemeldete Inhalte", "Contenus signalés par les utilisateurs"],
  "Cria lembretes para não te esqueceres de dar a medicação ou fazer um tratamento.": ["Create reminders so you don't forget medication or treatments.", "Crea recordatorios para no olvidar la medicación o un tratamiento.", "Erstelle Erinnerungen, damit du Medikamente oder Behandlungen nicht vergisst.", "Créez des rappels pour ne pas oublier les médicaments ou les traitements."],
  "Criar conta": ["Create account", "Crear cuenta", "Konto erstellen", "Créer un compte"],
  "Criar código": ["Create code", "Crear código", "Code erstellen", "Créer un code"],
  "Crie o perfil do seu pet e comece a organizar a sua saúde.": ["Create your pet's profile and start organising its health.", "Cree el perfil de su mascota y empiece a organizar su salud.", "Legen Sie das Profil Ihres Tieres an und organisieren Sie seine Gesundheit.", "Créez le profil de votre animal et organisez sa santé."],
  "Cuide da saúde do seu animal": ["Take care of your pet's health", "Cuide la salud de su mascota", "Kümmern Sie sich um die Gesundheit Ihres Tieres", "Prenez soin de la santé de votre animal"],
  "Cuide do seu animal": ["Take care of your pet", "Cuide de su mascota", "Kümmern Sie sich um Ihr Tier", "Prenez soin de votre animal"],
  "Código (opcional)": ["Code (optional)", "Código (opcional)", "Code (optional)", "Code (facultatif)"],
  "Código criado": ["Code created", "Código creado", "Code erstellt", "Code créé"],
  "Código de Parceiro": ["Partner Code", "Código de socio", "Partner-Code", "Code partenaire"],
  "Código de identificação": ["Identification code", "Código de identificación", "Kennnummer", "Code d'identification"],
  "Código dele (opcional)": ["Their code (optional)", "Su código (opcional)", "Sein Code (optional)", "Son code (facultatif)"],
  "Data da consulta": ["Appointment date", "Fecha de la consulta", "Termindatum", "Date du rendez-vous"],
  "Data de administração": ["Date given", "Fecha de administración", "Datum der Verabreichung", "Date d'administration"],
  "Data de aplicação": ["Date applied", "Fecha de aplicación", "Datum der Anwendung", "Date d'application"],
  "Data de fim (opcional)": ["End date (optional)", "Fecha de fin (opcional)", "Enddatum (optional)", "Date de fin (facultative)"],
  "Data de início": ["Start date", "Fecha de inicio", "Startdatum", "Date de début"],
  "Data de nascimento": ["Date of birth", "Fecha de nacimiento", "Geburtsdatum", "Date de naissance"],
  "Denúncias": ["Reports", "Denuncias", "Meldungen", "Signalements"],
  "Descreva em detalhe o que observou...": ["Describe in detail what you saw...", "Describa en detalle lo que observó...", "Beschreiben Sie ausführlich, was Sie beobachtet haben...", "Décrivez en détail ce que vous avez observé..."],
  "Descreva o animal, produto ou serviço com detalhe...": ["Describe the pet, product or service in detail...", "Describa la mascota, el producto o el servicio en detalle...", "Beschreiben Sie das Tier, Produkt oder die Leistung im Detail...", "Décrivez l'animal, le produit ou le service en détail..."],
  "Descreva o motivo da consulta...": ["Describe the reason for the appointment...", "Describa el motivo de la consulta...", "Beschreiben Sie den Grund des Termins...", "Décrivez le motif du rendez-vous..."],
  "Descreva o motivo...": ["Describe the reason...", "Describa el motivo...", "Beschreiben Sie den Grund...", "Décrivez le motif..."],
  "Descreve o que observaste...": ["Describe what you saw...", "Describe lo que observaste...", "Beschreibe, was du beobachtet hast...", "Décrivez ce que vous avez observé..."],
  "Descreve os serviços e especialidades...": ["Describe the services and specialities...", "Describe los servicios y especialidades...", "Beschreibe die Leistungen und Spezialgebiete...", "Décrivez les services et les spécialités..."],
  "Descrição": ["Description", "Descripción", "Beschreibung", "Description"],
  "Descrição *": ["Description *", "Descripción *", "Beschreibung *", "Description *"],
  "Desparasitação": ["Deworming", "Desparasitación", "Entwurmung", "Vermifugation"],
  "Diário de Saúde": ["Health Diary", "Diario de salud", "Gesundheitstagebuch", "Journal de santé"],
  "Diário de Saúde ❤️": ["Health Diary ❤️", "Diario de salud ❤️", "Gesundheitstagebuch ❤️", "Journal de santé ❤️"],
  "Diário vazio": ["Diary is empty", "Diario vacío", "Tagebuch ist leer", "Journal vide"],
  "Documento adicionado com sucesso.": ["Document added successfully.", "Documento añadido con éxito.", "Dokument erfolgreich hinzugefügt.", "Document ajouté avec succès."],
  "Dosagem, instruções...": ["Dosage, instructions...", "Dosis, instrucciones...", "Dosierung, Hinweise...", "Dosage, instructions..."],
  "Dose de": ["Dose of", "Dosis de", "Dosis von", "Dose de"],
  "Duração": ["Duration", "Duración", "Dauer", "Durée"],

  // ── Formulários, campos e exemplos ────────────────────────────────────
  "Eliminar animal": ["Delete pet", "Eliminar mascota", "Tier löschen", "Supprimer l'animal"],
  "Em Portugal, o número de emergência é o": ["In Portugal, the emergency number is", "En Portugal, el número de emergencia es el", "In Portugal lautet die Notrufnummer", "Au Portugal, le numéro d'urgence est le"],
  "Em breve": ["Coming soon", "Próximamente", "Demnächst", "Bientôt disponible"],
  "Em caso de emergência grave, contacte sempre um veterinário. Este guia é de apoio, baseado em fontes veterinárias reconhecidas — não substitui cuidados médicos.": ["In a serious emergency always contact a vet. This guide is support material based on recognised veterinary sources — it does not replace medical care.", "En caso de emergencia grave, contacte siempre con un veterinario. Esta guía es de apoyo, basada en fuentes veterinarias reconocidas: no sustituye la atención médica.", "Bei einem ernsten Notfall wenden Sie sich immer an eine Tierärztin oder einen Tierarzt. Dieser Leitfaden dient der Unterstützung und beruht auf anerkannten veterinärmedizinischen Quellen — er ersetzt keine medizinische Versorgung.", "En cas d'urgence grave, contactez toujours un vétérinaire. Ce guide est un support fondé sur des sources vétérinaires reconnues — il ne remplace pas des soins médicaux."],
  "Email do vet (para partilhar o link)": ["Vet's email (to share the link)", "Email del veterinario (para compartir el enlace)", "E-Mail des Tierarztes (um den Link zu teilen)", "E-mail du vétérinaire (pour partager le lien)"],
  "Entrada no Diário": ["Diary Entry", "Entrada del diario", "Tagebucheintrag", "Entrée du journal"],
  "Entrada no diário adicionada.": ["Diary entry added.", "Entrada del diario añadida.", "Tagebucheintrag hinzugefügt.", "Entrée ajoutée au journal."],
  "Envia a primeira mensagem!": ["Send the first message!", "¡Envía el primer mensaje!", "Schick die erste Nachricht!", "Envoyez le premier message !"],
  "Enviamos um link para o teu email.": ["We've sent a link to your email.", "Te hemos enviado un enlace por email.", "Wir haben dir einen Link per E-Mail geschickt.", "Nous vous avons envoyé un lien par e-mail."],
  "Enviar Avaliação": ["Send Review", "Enviar valoración", "Bewertung senden", "Envoyer l'avis"],
  "Escreva um comentário...": ["Write a comment...", "Escriba un comentario...", "Kommentar schreiben...", "Écrivez un commentaire..."],
  "Escreve um comentário...": ["Write a comment...", "Escribe un comentario...", "Kommentar schreiben...", "Écrivez un commentaire..."],
  "Escreve uma mensagem...": ["Write a message...", "Escribe un mensaje...", "Nachricht schreiben...", "Écrivez un message..."],
  "Espécie": ["Species", "Especie", "Tierart", "Espèce"],
  "Espécie *": ["Species *", "Especie *", "Tierart *", "Espèce *"],
  "Esqueceu a senha?": ["Forgot your password?", "¿Olvidó la contraseña?", "Passwort vergessen?", "Mot de passe oublié ?"],
  "Esta ação não pode ser desfeita.": ["This action cannot be undone.", "Esta acción no se puede deshacer.", "Diese Aktion kann nicht rückgängig gemacht werden.", "Cette action est irréversible."],
  "Este animal ainda não tem QR Code gerado. Tente novamente em breve.": ["This pet has no QR code yet. Please try again shortly.", "Esta mascota aún no tiene código QR. Inténtelo de nuevo en breve.", "Für dieses Tier wurde noch kein QR-Code erstellt. Bitte versuchen Sie es gleich erneut.", "Cet animal n'a pas encore de QR code. Réessayez dans un instant."],
  "Este painel é só para a administração da PetsLife.": ["This panel is for PetsLife administration only.", "Este panel es solo para la administración de PetsLife.", "Dieses Panel ist nur für die PetsLife-Administration.", "Ce panneau est réservé à l'administration PetsLife."],
  "Está tudo bem": ["Everything is fine", "Todo está bien", "Alles in Ordnung", "Tout va bien"],
  "Está tudo tranquilo. Quando alguém denunciar conteúdo, aparece aqui.": ["All quiet. When someone reports content, it shows up here.", "Todo tranquilo. Cuando alguien denuncie contenido, aparecerá aquí.", "Alles ruhig. Wenn jemand Inhalte meldet, erscheinen sie hier.", "Tout est calme. Quand quelqu'un signale un contenu, il apparaît ici."],
  "Evolução do Peso": ["Weight Progress", "Evolución del peso", "Gewichtsverlauf", "Évolution du poids"],
  "Ex: 1 comprimido de manhã e à noite...": ["e.g. 1 tablet morning and night...", "Ej.: 1 comprimido por la mañana y por la noche...", "z. B. 1 Tablette morgens und abends...", "Ex. : 1 comprimé matin et soir..."],
  "Ex: Antibiótico, Anti-inflamatório...": ["e.g. Antibiotic, Anti-inflammatory...", "Ej.: Antibiótico, antiinflamatorio...", "z. B. Antibiotikum, Entzündungshemmer...", "Ex. : Antibiotique, anti-inflammatoire..."],
  "Ex: Antibiótico, Vermífugo...": ["e.g. Antibiotic, Dewormer...", "Ej.: Antibiótico, antiparasitario...", "z. B. Antibiotikum, Wurmkur...", "Ex. : Antibiotique, vermifuge..."],
  "Ex: Cachorro Labrador para adopção": ["e.g. Labrador puppy for adoption", "Ej.: Cachorro labrador en adopción", "z. B. Labrador-Welpe zur Adoption", "Ex. : Chiot labrador à adopter"],
  "Ex: Check-up anual, Vacinação anual...": ["e.g. Annual check-up, annual vaccination...", "Ej.: Revisión anual, vacunación anual...", "z. B. Jahresuntersuchung, jährliche Impfung...", "Ex. : Bilan annuel, vaccination annuelle..."],
  "Ex: Check-up anual, Vacinação...": ["e.g. Annual check-up, vaccination...", "Ej.: Revisión anual, vacunación...", "z. B. Jahresuntersuchung, Impfung...", "Ex. : Bilan annuel, vaccination..."],
  "Ex: Clínica Vet Lisboa": ["e.g. Lisbon Vet Clinic", "Ej.: Clínica Vet Lisboa", "z. B. Tierklinik Lissabon", "Ex. : Clinique Vét Lisbonne"],
  "Ex: Clínica Veterinária Central": ["e.g. Central Veterinary Clinic", "Ej.: Clínica Veterinaria Central", "z. B. Tierarztpraxis Zentrum", "Ex. : Clinique vétérinaire du Centre"],
  "Ex: Consulta de rotina...": ["e.g. Routine appointment...", "Ej.: Consulta de rutina...", "z. B. Routineuntersuchung...", "Ex. : Consultation de routine..."],
  "Ex: Dr. António Silva": ["e.g. Dr. Anthony Smith", "Ej.: Dr. Antonio Silva", "z. B. Dr. Anton Schmidt", "Ex. : Dr Antoine Silva"],
  "Ex: Influencer João": ["e.g. Influencer John", "Ej.: Influencer Juan", "z. B. Influencer Jan", "Ex. : Influenceur Jean"],
  "Ex: JOAO — deixa vazio para gerar": ["e.g. JOHN — leave blank to generate", "Ej.: JUAN — déjalo vacío para generarlo", "z. B. JAN — leer lassen zum Erzeugen", "Ex. : JEAN — laissez vide pour générer"],
  "Ex: JOAO10 — vazio para gerar": ["e.g. JOHN10 — blank to generate", "Ej.: JUAN10 — vacío para generarlo", "z. B. JAN10 — leer zum Erzeugen", "Ex. : JEAN10 — vide pour générer"],
  "Ex: Labrador, Siamês...": ["e.g. Labrador, Siamese...", "Ej.: Labrador, siamés...", "z. B. Labrador, Siam...", "Ex. : Labrador, siamois..."],
  "Ex: Lisboa, Porto, Setúbal...": ["e.g. London, Manchester, Leeds...", "Ej.: Madrid, Barcelona, Valencia...", "z. B. Berlin, Hamburg, München...", "Ex. : Paris, Lyon, Marseille..."],
  "Ex: Passaporte Europeu, Licença Municipal...": ["e.g. European passport, municipal licence...", "Ej.: Pasaporte europeo, licencia municipal...", "z. B. EU-Heimtierausweis, städtische Lizenz...", "Ex. : Passeport européen, licence municipale..."],
  "Ex: Raiva, Parvovírus, Esgana, Leucemia...": ["e.g. Rabies, Parvovirus, Distemper, Leukaemia...", "Ej.: Rabia, parvovirus, moquillo, leucemia...", "z. B. Tollwut, Parvovirose, Staupe, Leukose...", "Ex. : Rage, parvovirose, maladie de Carré, leucose..."],
  "Ex: Raiva, Parvovírus, Esgana...": ["e.g. Rabies, Parvovirus, Distemper...", "Ej.: Rabia, parvovirus, moquillo...", "z. B. Tollwut, Parvovirose, Staupe...", "Ex. : Rage, parvovirose, maladie de Carré..."],
  "Ex: Raiva, Parvovírus...": ["e.g. Rabies, Parvovirus...", "Ej.: Rabia, parvovirus...", "z. B. Tollwut, Parvovirose...", "Ex. : Rage, parvovirose..."],
  "Ex: Seg-Sex 9h-18h, Sáb 9h-13h": ["e.g. Mon-Fri 9am-6pm, Sat 9am-1pm", "Ej.: Lun-Vie 9h-18h, Sáb 9h-13h", "z. B. Mo-Fr 9-18 Uhr, Sa 9-13 Uhr", "Ex. : Lun-Ven 9h-18h, Sam 9h-13h"],
  "Ex: Vómito após refeição, Letargia...": ["e.g. Vomiting after meals, lethargy...", "Ej.: Vómito tras la comida, letargo...", "z. B. Erbrechen nach dem Fressen, Mattigkeit...", "Ex. : Vomissements après le repas, léthargie..."],
  "Ex: dar com comida": ["e.g. give with food", "Ej.: dar con comida", "z. B. mit Futter geben", "Ex. : à donner avec de la nourriture"],
  "Ex: story de Agosto": ["e.g. August story", "Ej.: story de agosto", "z. B. Story im August", "Ex. : story d'août"],
  "Fala com outros donos a partir da Comunidade, do Marketplace ou dos anúncios de animais perdidos.": ["Chat with other owners from the Community, the Marketplace or the lost pet listings.", "Habla con otros dueños desde la Comunidad, el Marketplace o los anuncios de mascotas perdidas.", "Sprich mit anderen Haltern über die Community, den Marktplatz oder die Vermisstenanzeigen.", "Discutez avec d'autres propriétaires depuis la Communauté, la Marketplace ou les annonces d'animaux perdus."],
  "Fale com o seu vet por videochamada": ["Talk to your vet by video call", "Hable con su veterinario por videollamada", "Sprechen Sie per Videoanruf mit Ihrem Tierarzt", "Parlez à votre vétérinaire en visioconférence"],
  "Farmácia Veterinária 💊": ["Vet Pharmacy 💊", "Farmacia veterinaria 💊", "Tierapotheke 💊", "Pharmacie vétérinaire 💊"],
  "Foto / Scan da receita": ["Photo / scan of the prescription", "Foto / escaneo de la receta", "Foto / Scan des Rezepts", "Photo / scan de l'ordonnance"],
  "Foto / Scan do documento": ["Photo / scan of the document", "Foto / escaneo del documento", "Foto / Scan des Dokuments", "Photo / scan du document"],
  "Frequência": ["Frequency", "Frecuencia", "Häufigkeit", "Fréquence"],
  "Gerencie a saúde dos seus animais": ["Manage your pets' health", "Gestione la salud de sus mascotas", "Verwalten Sie die Gesundheit Ihrer Tiere", "Gérez la santé de vos animaux"],
  "Grooming e estética para o seu pet": ["Grooming and styling for your pet", "Peluquería y estética para su mascota", "Pflege und Styling für Ihr Tier", "Toilettage et esthétique pour votre animal"],
  "Guardar": ["Save", "Guardar", "Speichern", "Enregistrer"],
  "Guardar Animal": ["Save Pet", "Guardar mascota", "Tier speichern", "Enregistrer l'animal"],
  "Guardar Consulta": ["Save Appointment", "Guardar consulta", "Termin speichern", "Enregistrer le rendez-vous"],
  "Guardar Desparasitação": ["Save Deworming", "Guardar desparasitación", "Entwurmung speichern", "Enregistrer la vermifugation"],
  "Guardar Documento": ["Save Document", "Guardar documento", "Dokument speichern", "Enregistrer le document"],
  "Guardar Entrada": ["Save Entry", "Guardar entrada", "Eintrag speichern", "Enregistrer l'entrée"],
  "Guardar Peso": ["Save Weight", "Guardar peso", "Gewicht speichern", "Enregistrer le poids"],
  "Guardar Receita": ["Save Prescription", "Guardar receta", "Rezept speichern", "Enregistrer l'ordonnance"],
  "Guardar Vacina": ["Save Vaccine", "Guardar vacuna", "Impfung speichern", "Enregistrer le vaccin"],
  "Guardar alterações": ["Save changes", "Guardar cambios", "Änderungen speichern", "Enregistrer les modifications"],
  "Guardar lembrete": ["Save reminder", "Guardar recordatorio", "Erinnerung speichern", "Enregistrer le rappel"],
  "Guarde o passaporte, seguros, exames e mais do seu animal! Tudo organizado 📂✨": ["Keep your pet's passport, insurance, test results and more! All organised 📂✨", "¡Guarde el pasaporte, seguros, análisis y más de su mascota! Todo organizado 📂✨", "Bewahren Sie Heimtierausweis, Versicherung, Befunde und mehr auf! Alles geordnet 📂✨", "Conservez le passeport, les assurances, les examens et plus encore ! Tout est organisé 📂✨"],
  "Guarde todas as receitas do seu bichinho num só lugar! 💜🐾": ["Keep all your pet's prescriptions in one place! 💜🐾", "¡Guarde todas las recetas de su mascota en un solo lugar! 💜🐾", "Bewahren Sie alle Rezepte Ihres Tieres an einem Ort auf! 💜🐾", "Conservez toutes les ordonnances de votre animal au même endroit ! 💜🐾"],
  "Guia de Raças 📖": ["Breed Guide 📖", "Guía de razas 📖", "Rasseführer 📖", "Guide des races 📖"],
  "Guia de Videochamada": ["Video Call Guide", "Guía de videollamada", "Leitfaden für Videoanrufe", "Guide de la visioconférence"],
  "Guia de emergência para animais": ["Emergency guide for pets", "Guía de emergencia para mascotas", "Notfall-Leitfaden für Tiere", "Guide d'urgence pour animaux"],
  "Guias com vídeo incluído": ["Guides with video included", "Guías con vídeo incluido", "Anleitungen mit Video", "Guides avec vidéo incluse"],
  "Histórico": ["History", "Historial", "Verlauf", "Historique"],
  "Horário": ["Opening hours", "Horario", "Öffnungszeiten", "Horaires"],
  "Hospedagem confortável para o seu pet": ["Comfortable boarding for your pet", "Alojamiento cómodo para su mascota", "Komfortable Unterbringung für Ihr Tier", "Hébergement confortable pour votre animal"],
  "Hotéis para Animais": ["Pet Hotels", "Hoteles para mascotas", "Tierhotels", "Hôtels pour animaux"],
  "Há só um link, e é este (a caixa verde). Partilhe-o com o veterinário — é por aqui que os dois entram na videochamada.": ["There's only one link, and it's this one (the green box). Share it with the vet — this is how you both join the video call.", "Solo hay un enlace, y es este (la caja verde). Compártalo con el veterinario: por aquí entran los dos a la videollamada.", "Es gibt nur einen Link, nämlich diesen (das grüne Feld). Teilen Sie ihn mit der Tierärztin oder dem Tierarzt — darüber treten Sie beide dem Videoanruf bei.", "Il n'y a qu'un seul lien, celui-ci (la case verte). Partagez-le avec le vétérinaire — c'est par là que vous rejoignez tous les deux l'appel vidéo."],
  "Imprima este QR code e coloque na coleira do seu animal para máxima segurança.": ["Print this QR code and attach it to your pet's collar for maximum safety.", "Imprima este código QR y colóquelo en el collar de su mascota para máxima seguridad.", "Drucken Sie diesen QR-Code aus und befestigen Sie ihn am Halsband Ihres Tieres.", "Imprimez ce QR code et fixez-le au collier de votre animal pour plus de sécurité."],
  "Informações": ["Information", "Información", "Informationen", "Informations"],
  "Introduz o teu PIN para ver os parceiros e o desempenho de cada um.": ["Enter your PIN to see the partners and how each one is doing.", "Introduce tu PIN para ver los socios y el rendimiento de cada uno.", "Gib deine PIN ein, um die Partner und ihre Leistung zu sehen.", "Saisissez votre code PIN pour voir les partenaires et leurs performances."],
  "Ir para a Comunidade": ["Go to Community", "Ir a la Comunidad", "Zur Community", "Aller à la Communauté"],
  "Ir para a app": ["Go to the app", "Ir a la app", "Zur App", "Aller à l'application"],
  "Ir para consultas": ["Go to appointments", "Ir a consultas", "Zu den Terminen", "Aller aux rendez-vous"],
  "Já dei / já fiz": ["Done / given", "Ya lo he dado / hecho", "Erledigt / gegeben", "Déjà donné / fait"],
  "Já encontrei!": ["Found them!", "¡Ya lo encontré!", "Gefunden!", "Je l'ai retrouvé !"],
  "Ligar ao Veterinário": ["Call the Vet", "Llamar al veterinario", "Tierarzt anrufen", "Appeler le vétérinaire"],
  "Limpar notificações": ["Clear notifications", "Borrar notificaciones", "Benachrichtigungen löschen", "Effacer les notifications"],
  "Link da consulta (este verde é o único)": ["Appointment link (the green one is the only one)", "Enlace de la consulta (el verde es el único)", "Termin-Link (der grüne ist der einzige)", "Lien du rendez-vous (le vert est le seul)"],
  "Link para marcar consulta": ["Link to book an appointment", "Enlace para pedir cita", "Link zur Terminbuchung", "Lien pour prendre rendez-vous"],
  "Local / Clínica": ["Place / Clinic", "Lugar / clínica", "Ort / Klinik", "Lieu / clinique"],
  "Localização": ["Location", "Ubicación", "Standort", "Localisation"],
  "Lote da vacina": ["Vaccine batch", "Lote de la vacuna", "Chargennummer des Impfstoffs", "Lot du vaccin"],

  // ── Listas vazias, negócios, marketplace ──────────────────────────────
  "Manter o peso ideal é sinal de saúde e felicidade! 🐾💙": ["Keeping the ideal weight is a sign of health and happiness! 🐾💙", "¡Mantener el peso ideal es señal de salud y felicidad! 🐾💙", "Das Idealgewicht zu halten ist ein Zeichen für Gesundheit und Glück! 🐾💙", "Garder le poids idéal est signe de santé et de bonheur ! 🐾💙"],
  "Medicação, tratamentos, vacinas e consultas": ["Medication, treatments, vaccines and appointments", "Medicación, tratamientos, vacunas y consultas", "Medikamente, Behandlungen, Impfungen und Termine", "Médicaments, traitements, vaccins et rendez-vous"],
  "Motivo / Título *": ["Reason / Title *", "Motivo / título *", "Grund / Titel *", "Motif / Titre *"],
  "Médico veterinário": ["Veterinarian", "Veterinario", "Tierärztin / Tierarzt", "Vétérinaire"],
  "Mínimo": ["Minimum", "Mínimo", "Minimum", "Minimum"],
  "Mínimo 8 caracteres": ["At least 8 characters", "Mínimo 8 caracteres", "Mindestens 8 Zeichen", "8 caractères minimum"],
  "Negócios": ["Businesses", "Negocios", "Unternehmen", "Entreprises"],
  "Nenhum animal disponível para adoção neste momento.": ["No pets available for adoption right now.", "No hay mascotas disponibles para adopción en este momento.", "Zurzeit sind keine Tiere zur Adoption verfügbar.", "Aucun animal disponible à l'adoption pour le moment."],
  "Nenhum animal perdido": ["No lost pets", "Ninguna mascota perdida", "Keine vermissten Tiere", "Aucun animal perdu"],
  "Nenhum anúncio encontrado": ["No listings found", "No se han encontrado anuncios", "Keine Anzeigen gefunden", "Aucune annonce trouvée"],
  "Nenhum documento. Adicione passaporte, licenças, exames ou outros documentos.": ["No documents. Add a passport, licences, test results or other documents.", "Sin documentos. Añada pasaporte, licencias, análisis u otros documentos.", "Keine Dokumente. Fügen Sie Heimtierausweis, Lizenzen, Befunde oder andere Dokumente hinzu.", "Aucun document. Ajoutez un passeport, des licences, des examens ou d'autres documents."],
  "Nenhum peso registado. Acompanhe o crescimento do seu animal.": ["No weight recorded. Track your pet's growth.", "No hay pesos registrados. Siga el crecimiento de su mascota.", "Kein Gewicht erfasst. Verfolgen Sie das Wachstum Ihres Tieres.", "Aucun poids enregistré. Suivez la croissance de votre animal."],
  "Nenhuma desparasitação registada.": ["No deworming recorded.", "No hay desparasitaciones registradas.", "Keine Entwurmung erfasst.", "Aucune vermifugation enregistrée."],
  "Nenhuma entrada no diário de saúde. Registe sintomas, comportamentos, medicações e mais.": ["No health diary entries. Record symptoms, behaviour, medication and more.", "No hay entradas en el diario de salud. Registre síntomas, comportamientos, medicación y más.", "Keine Einträge im Gesundheitstagebuch. Erfassen Sie Symptome, Verhalten, Medikamente und mehr.", "Aucune entrée dans le journal de santé. Notez symptômes, comportements, médicaments et plus."],
  "Nenhuma raça encontrada": ["No breed found", "No se ha encontrado ninguna raza", "Keine Rasse gefunden", "Aucune race trouvée"],
  "Nenhuma receita médica. Tire uma foto ou faça upload da receita.": ["No prescriptions. Take a photo or upload the prescription.", "No hay recetas médicas. Haga una foto o suba la receta.", "Keine Rezepte. Machen Sie ein Foto oder laden Sie das Rezept hoch.", "Aucune ordonnance. Prenez une photo ou téléversez l'ordonnance."],
  "Nenhuma vacina registada. Adicione a caderneta de vacinação do seu animal.": ["No vaccines recorded. Add your pet's vaccination record.", "No hay vacunas registradas. Añada la cartilla de vacunación de su mascota.", "Keine Impfungen erfasst. Fügen Sie den Impfpass Ihres Tieres hinzu.", "Aucun vaccin enregistré. Ajoutez le carnet de vaccination de votre animal."],
  "Nome": ["Name", "Nombre", "Name", "Nom"],
  "Nome *": ["Name *", "Nombre *", "Name *", "Nom *"],
  "Nome completo": ["Full name", "Nombre completo", "Vollständiger Name", "Nom complet"],
  "Nome da clínica": ["Clinic name", "Nombre de la clínica", "Name der Klinik", "Nom de la clinique"],
  "Nome da vacina *": ["Vaccine name *", "Nombre de la vacuna *", "Name des Impfstoffs *", "Nom du vaccin *"],
  "Nome do médico veterinário": ["Veterinarian's name", "Nombre del veterinario", "Name der Tierärztin / des Tierarztes", "Nom du vétérinaire"],
  "Nome do negócio *": ["Business name *", "Nombre del negocio *", "Name des Unternehmens *", "Nom de l'entreprise *"],
  "Nome do parceiro": ["Partner name", "Nombre del socio", "Name des Partners", "Nom du partenaire"],
  "Nome do veterinário": ["Vet's name", "Nombre del veterinario", "Name des Tierarztes", "Nom du vétérinaire"],
  "Nome do veterinário (opcional)": ["Vet's name (optional)", "Nombre del veterinario (opcional)", "Name des Tierarztes (optional)", "Nom du vétérinaire (facultatif)"],
  "Nossas Missões": ["Our Missions", "Nuestras misiones", "Unsere Missionen", "Nos missions"],
  "Notificações 🔔": ["Notifications 🔔", "Notificaciones 🔔", "Benachrichtigungen 🔔", "Notifications 🔔"],
  "Nova Consulta": ["New Appointment", "Nueva consulta", "Neuer Termin", "Nouveau rendez-vous"],
  "Nova Consulta 📅": ["New Appointment 📅", "Nueva consulta 📅", "Neuer Termin 📅", "Nouveau rendez-vous 📅"],
  "Nova Desparasitação": ["New Deworming", "Nueva desparasitación", "Neue Entwurmung", "Nouvelle vermifugation"],
  "Nova Receita Médica": ["New Prescription", "Nueva receta médica", "Neues Rezept", "Nouvelle ordonnance"],
  "Nova Vacina": ["New Vaccine", "Nueva vacuna", "Neue Impfung", "Nouveau vaccin"],
  "Nova Vacina 💉": ["New Vaccine 💉", "Nueva vacuna 💉", "Neue Impfung 💉", "Nouveau vaccin 💉"],
  "Nova missão": ["New mission", "Nueva misión", "Neue Mission", "Nouvelle mission"],
  "Novo Anúncio": ["New Listing", "Nuevo anuncio", "Neue Anzeige", "Nouvelle annonce"],
  "Novo Documento": ["New Document", "Nuevo documento", "Neues Dokument", "Nouveau document"],
  "Novo código": ["New code", "Nuevo código", "Neuer Code", "Nouveau code"],
  "Novo código para dar aos seguidores": ["New code to give to followers", "Nuevo código para dar a los seguidores", "Neuer Code für die Follower", "Nouveau code à donner aux abonnés"],
  "Novo lembrete": ["New reminder", "Nuevo recordatorio", "Neue Erinnerung", "Nouveau rappel"],
  "Novo parceiro": ["New partner", "Nuevo socio", "Neuer Partner", "Nouveau partenaire"],
  "Não": ["No", "No", "Nein", "Non"],
  "Número de lote": ["Batch number", "Número de lote", "Chargennummer", "Numéro de lot"],
  "O anúncio foi publicado com sucesso.": ["The listing was published successfully.", "El anuncio se ha publicado con éxito.", "Die Anzeige wurde erfolgreich veröffentlicht.", "L'annonce a été publiée avec succès."],
  "O email não pode ser alterado aqui": ["The email cannot be changed here", "El email no se puede cambiar aquí", "Die E-Mail-Adresse kann hier nicht geändert werden", "L'e-mail ne peut pas être modifié ici"],
  "O que QUEM USA recebe": ["What the USER gets", "Lo que recibe QUIEN LO USA", "Was die NUTZERIN oder der NUTZER bekommt", "Ce que reçoit L'UTILISATEUR"],
  "O que o PARCEIRO recebe": ["What the PARTNER gets", "Lo que recibe EL SOCIO", "Was der PARTNER bekommt", "Ce que reçoit LE PARTENAIRE"],
  "O que precisa": ["What you need", "Lo que necesita", "Was Sie brauchen", "Ce dont vous avez besoin"],
  "O que quer registar?": ["What do you want to record?", "¿Qué quiere registrar?", "Was möchten Sie erfassen?", "Que souhaitez-vous enregistrer ?"],
  "O seu animal já voltou para casa? 🏠": ["Has your pet come home? 🏠", "¿Su mascota ya ha vuelto a casa? 🏠", "Ist Ihr Tier schon wieder zu Hause? 🏠", "Votre animal est-il rentré à la maison ? 🏠"],
  "O seu anúncio foi publicado.": ["Your listing has been published.", "Su anuncio se ha publicado.", "Ihre Anzeige wurde veröffentlicht.", "Votre annonce a été publiée."],
  "O seu anúncio será visível para toda a comunidade PetsLife. Certifique-se de que as informações são corretas.": ["Your listing will be visible to the whole PetsLife community. Make sure the information is correct.", "Su anuncio será visible para toda la comunidad PetsLife. Asegúrese de que la información es correcta.", "Ihre Anzeige ist für die gesamte PetsLife-Community sichtbar. Prüfen Sie, ob die Angaben stimmen.", "Votre annonce sera visible par toute la communauté PetsLife. Vérifiez que les informations sont correctes."],
  "O seu nome": ["Your name", "Su nombre", "Ihr Name", "Votre nom"],
  "O teu negócio já está visível para todos os utilizadores.": ["Your business is now visible to all users.", "Su negocio ya es visible para todos los usuarios.", "Ihr Unternehmen ist jetzt für alle Nutzer sichtbar.", "Votre entreprise est désormais visible par tous les utilisateurs."],
  "Observações, diagnóstico, tratamento...": ["Notes, diagnosis, treatment...", "Observaciones, diagnóstico, tratamiento...", "Notizen, Diagnose, Behandlung...", "Observations, diagnostic, traitement..."],
  "Observações...": ["Notes...", "Observaciones...", "Notizen...", "Observations..."],
  "Os avisos deste animal foram encerrados. 🐾": ["The alerts for this pet have been closed. 🐾", "Las alertas de esta mascota se han cerrado. 🐾", "Die Hinweise für dieses Tier wurden geschlossen. 🐾", "Les alertes de cet animal ont été clôturées. 🐾"],
  "Os guias da PetsLife são baseados em fontes veterinárias reconhecidas.": ["PetsLife guides are based on recognised veterinary sources.", "Las guías de PetsLife se basan en fuentes veterinarias reconocidas.", "Die PetsLife-Ratgeber beruhen auf anerkannten veterinärmedizinischen Quellen.", "Les guides PetsLife s'appuient sur des sources vétérinaires reconnues."],
  "Os meus animais": ["My pets", "Mis mascotas", "Meine Tiere", "Mes animaux"],
  "Os meus pets": ["My pets", "Mis mascotas", "Meine Tiere", "Mes animaux"],
  "Os teus animais estão com as vacinas e desparasitações em dia. Continua assim! 🐾": ["Your pets are up to date with vaccines and deworming. Keep it up! 🐾", "Tus mascotas están al día con las vacunas y desparasitaciones. ¡Sigue así! 🐾", "Deine Tiere sind bei Impfungen und Entwurmung auf dem neuesten Stand. Weiter so! 🐾", "Vos animaux sont à jour de vaccins et de vermifuges. Continuez ainsi ! 🐾"],
  "Partilhe este link com o veterinário. Os dois entram por ele — carregue no ícone para partilhar, ou em \"Entrar na chamada\" para entrar.": ["Share this link with the vet. You both join through it — tap the icon to share, or \"Join call\" to enter.", "Comparta este enlace con el veterinario. Los dos entran por él: pulse el icono para compartir o \"Entrar en la llamada\" para entrar.", "Teilen Sie diesen Link mit dem Tierarzt. Sie treten beide darüber bei — tippen Sie zum Teilen auf das Symbol oder auf \"Anruf beitreten\".", "Partagez ce lien avec le vétérinaire. Vous le rejoignez tous les deux — appuyez sur l'icône pour partager, ou sur « Rejoindre l'appel »."],
  "Passo a passo": ["Step by step", "Paso a paso", "Schritt für Schritt", "Étape par étape"],
  "Perfil atualizado com sucesso!": ["Profile updated successfully!", "¡Perfil actualizado con éxito!", "Profil erfolgreich aktualisiert!", "Profil mis à jour avec succès !"],
  "Pesquisar animais perdidos...": ["Search lost pets...", "Buscar mascotas perdidas...", "Vermisste Tiere suchen...", "Rechercher des animaux perdus..."],
  "Pesquisar animais...": ["Search pets...", "Buscar mascotas...", "Tiere suchen...", "Rechercher des animaux..."],
  "Pesquisar clínicas...": ["Search clinics...", "Buscar clínicas...", "Kliniken suchen...", "Rechercher des cliniques..."],
  "Pesquisar hotéis...": ["Search hotels...", "Buscar hoteles...", "Hotels suchen...", "Rechercher des hôtels..."],
  "Pesquisar negócios...": ["Search businesses...", "Buscar negocios...", "Unternehmen suchen...", "Rechercher des entreprises..."],
  "Pesquisar perto de si": ["Search near you", "Buscar cerca de usted", "In Ihrer Nähe suchen", "Rechercher près de chez vous"],
  "Pesquisar raça...": ["Search breed...", "Buscar raza...", "Rasse suchen...", "Rechercher une race..."],
  "Pesquisar serviços...": ["Search services...", "Buscar servicios...", "Dienste suchen...", "Rechercher des services..."],
  "Preenche o nome, localização e contacto": ["Fill in the name, location and contact", "Rellena el nombre, la ubicación y el contacto", "Name, Ort und Kontakt ausfüllen", "Renseignez le nom, le lieu et le contact"],
  "Preço (€)": ["Price (€)", "Precio (€)", "Preis (€)", "Prix (€)"],
  "Produtos recomendados para o seu animal": ["Recommended products for your pet", "Productos recomendados para su mascota", "Empfohlene Produkte für Ihr Tier", "Produits recommandés pour votre animal"],
  "Pronta para agendar?": ["Ready to book?", "¿Lista para reservar?", "Bereit für einen Termin?", "Prêt à réserver ?"],
  "Proteger o seu bichinho é o maior ato de amor! 🐾✨": ["Protecting your pet is the greatest act of love! 🐾✨", "¡Proteger a su mascota es el mayor acto de amor! 🐾✨", "Ihr Tier zu schützen ist der größte Liebesbeweis! 🐾✨", "Protéger votre animal est le plus grand acte d'amour ! 🐾✨"],
  "Próxima aplicação": ["Next application", "Próxima aplicación", "Nächste Anwendung", "Prochaine application"],
  "Próxima dose": ["Next dose", "Próxima dosis", "Nächste Dosis", "Prochaine dose"],
  "Próximas consultas": ["Upcoming appointments", "Próximas consultas", "Nächste Termine", "Prochains rendez-vous"],
  "Publica um anúncio para ajudar!": ["Post a listing to help!", "¡Publica un anuncio para ayudar!", "Poste eine Anzeige und hilf mit!", "Publiez une annonce pour aider !"],
  "Publicar Anúncio": ["Post Listing", "Publicar anuncio", "Anzeige aufgeben", "Publier l'annonce"],
  "QR Code do Animal": ["Pet QR Code", "Código QR de la mascota", "QR-Code des Tieres", "QR code de l'animal"],
  "QR Code não gerado ainda.": ["QR code not generated yet.", "El código QR aún no se ha generado.", "QR-Code wurde noch nicht erstellt.", "QR code pas encore généré."],

  // ── Perfil, conta, subscrição, avisos ─────────────────────────────────
  "Quando entrar na chamada pela primeira vez, o browser vai pedir permissão para aceder à câmara e ao microfone.": ["The first time you join the call, the browser will ask for permission to use the camera and microphone.", "La primera vez que entre en la llamada, el navegador pedirá permiso para acceder a la cámara y al micrófono.", "Beim ersten Beitritt fragt der Browser nach Zugriff auf Kamera und Mikrofon.", "La première fois que vous rejoignez l'appel, le navigateur demandera l'autorisation d'accéder à la caméra et au micro."],
  "Que alívio!": ["What a relief!", "¡Qué alivio!", "Was für eine Erleichterung!", "Quel soulagement !"],
  "Raça": ["Breed", "Raza", "Rasse", "Race"],
  "Reações, observações...": ["Reactions, notes...", "Reacciones, observaciones...", "Reaktionen, Notizen...", "Réactions, observations..."],
  "Recebeste um código de um parceiro ou influencer? Introduz aqui para activar o teu benefício.": ["Got a code from a partner or influencer? Enter it here to activate your benefit.", "¿Has recibido un código de un socio o influencer? Introdúcelo aquí para activar tu beneficio.", "Hast du einen Code von einem Partner oder Influencer? Gib ihn hier ein, um deinen Vorteil zu aktivieren.", "Vous avez reçu un code d'un partenaire ou d'un influenceur ? Saisissez-le ici pour activer votre avantage."],
  "Regista a tua clínica ou petshop!": ["Register your clinic or pet shop!", "¡Registra tu clínica o tienda de mascotas!", "Registriere deine Praxis oder deinen Tierladen!", "Enregistrez votre clinique ou votre animalerie !"],
  "Registar Negócio": ["Register Business", "Registrar negocio", "Unternehmen anmelden", "Enregistrer l'entreprise"],
  "Registe a caderneta de vacinação": ["Record the vaccination book", "Registre la cartilla de vacunación", "Impfpass erfassen", "Enregistrez le carnet de vaccination"],
  "Registe a caderneta de vacinação do seu bichinho! Cada vacina é um ato de amor 🐾": ["Record your pet's vaccination book! Every vaccine is an act of love 🐾", "¡Registre la cartilla de vacunación de su mascota! Cada vacuna es un acto de amor 🐾", "Erfassen Sie den Impfpass Ihres Tieres! Jede Impfung ist ein Liebesbeweis 🐾", "Enregistrez le carnet de vaccination de votre animal ! Chaque vaccin est un acte d'amour 🐾"],
  "Registe as consultas do seu bichinho aqui! Cada visita ao veterinário é um ato de amor 🩺": ["Record your pet's appointments here! Every vet visit is an act of love 🩺", "¡Registre aquí las consultas de su mascota! Cada visita al veterinario es un acto de amor 🩺", "Erfassen Sie hier die Termine Ihres Tieres! Jeder Tierarztbesuch ist ein Liebesbeweis 🩺", "Enregistrez ici les rendez-vous de votre animal ! Chaque visite chez le vétérinaire est un acte d'amour 🩺"],
  "Registe as desparasitações internas e externas do seu animal! 🛡️": ["Record your pet's internal and external deworming! 🛡️", "¡Registre las desparasitaciones internas y externas de su mascota! 🛡️", "Erfassen Sie die innere und äußere Entwurmung Ihres Tieres! 🛡️", "Enregistrez les vermifugations internes et externes de votre animal ! 🛡️"],
  "Registe o peso regularmente para acompanhar o crescimento saudável do seu bichinho! 📏": ["Record the weight regularly to follow your pet's healthy growth! 📏", "¡Registre el peso con regularidad para seguir el crecimiento sano de su mascota! 📏", "Erfassen Sie das Gewicht regelmäßig, um das gesunde Wachstum Ihres Tieres zu verfolgen! 📏", "Enregistrez le poids régulièrement pour suivre la croissance de votre animal ! 📏"],
  "Registe os momentos, sintomas e aventuras do seu bichinho! Cada entrada é uma memória 🐾💕": ["Record your pet's moments, symptoms and adventures! Every entry is a memory 🐾💕", "¡Registre los momentos, síntomas y aventuras de su mascota! Cada entrada es un recuerdo 🐾💕", "Halten Sie Momente, Symptome und Abenteuer Ihres Tieres fest! Jeder Eintrag ist eine Erinnerung 🐾💕", "Notez les moments, symptômes et aventures de votre animal ! Chaque entrée est un souvenir 🐾💕"],
  "Registe-se grátis": ["Sign up free", "Regístrese gratis", "Kostenlos registrieren", "Inscrivez-vous gratuitement"],
  "Rua, número, andar": ["Street, number, floor", "Calle, número, piso", "Straße, Hausnummer, Etage", "Rue, numéro, étage"],
  "Rua, número, código postal": ["Street, number, postcode", "Calle, número, código postal", "Straße, Hausnummer, PLZ", "Rue, numéro, code postal"],
  "Sair da conta": ["Sign out", "Cerrar sesión", "Abmelden", "Se déconnecter"],
  "Saúde": ["Health", "Salud", "Gesundheit", "Santé"],
  "Saúde 🏥": ["Health 🏥", "Salud 🏥", "Gesundheit 🏥", "Santé 🏥"],
  "Se o seu animal se perder, quem o encontrar pode ler este código para aceder ao seu perfil e contactá-lo.": ["If your pet gets lost, whoever finds it can scan this code to see the profile and contact you.", "Si su mascota se pierde, quien la encuentre puede leer este código para ver su perfil y contactarle.", "Wenn Ihr Tier verloren geht, kann der Finder diesen Code scannen, um das Profil zu sehen und Sie zu kontaktieren.", "Si votre animal se perd, la personne qui le trouve peut scanner ce code pour voir son profil et vous contacter."],
  "Seja o primeiro a registar uma clínica!": ["Be the first to register a clinic!", "¡Sea el primero en registrar una clínica!", "Seien Sie der Erste, der eine Praxis registriert!", "Soyez le premier à enregistrer une clinique !"],
  "Seja o primeiro a registar uma petshop!": ["Be the first to register a pet shop!", "¡Sea el primero en registrar una tienda de mascotas!", "Seien Sie der Erste, der einen Tierladen registriert!", "Soyez le premier à enregistrer une animalerie !"],
  "Sem animais": ["No pets", "Sin mascotas", "Keine Tiere", "Aucun animal"],
  "Sem animais para adoção": ["No pets for adoption", "Sin mascotas en adopción", "Keine Tiere zur Adoption", "Aucun animal à adopter"],
  "Sem animais registados": ["No pets registered", "Sin mascotas registradas", "Keine Tiere registriert", "Aucun animal enregistré"],
  "Sem clínicas encontradas": ["No clinics found", "No se han encontrado clínicas", "Keine Kliniken gefunden", "Aucune clinique trouvée"],
  "Sem contacto disponível": ["No contact available", "Sin contacto disponible", "Kein Kontakt verfügbar", "Aucun contact disponible"],
  "Sem denúncias": ["No reports", "Sin denuncias", "Keine Meldungen", "Aucun signalement"],
  "Sem deslocações. Sem esperas. Fale com o veterinário em directo por videochamada, directamente aqui na app — gratuito e sem instalações.": ["No travelling. No waiting. Talk to the vet live by video call, right here in the app — free and with no installs.", "Sin desplazamientos. Sin esperas. Hable con el veterinario en directo por videollamada, aquí mismo en la app: gratis y sin instalaciones.", "Keine Fahrt. Keine Wartezeit. Sprechen Sie live per Videoanruf direkt in der App mit dem Tierarzt — kostenlos und ohne Installation.", "Sans déplacement. Sans attente. Parlez au vétérinaire en direct par visioconférence, ici dans l'application — gratuit et sans installation."],
  "Sem hotéis disponíveis": ["No hotels available", "Sin hoteles disponibles", "Keine Hotels verfügbar", "Aucun hôtel disponible"],
  "Sem negócios ainda": ["No businesses yet", "Todavía sin negocios", "Noch keine Unternehmen", "Pas encore d'entreprises"],
  "Sem registos de peso": ["No weight records", "Sin registros de peso", "Keine Gewichtseinträge", "Aucun enregistrement de poids"],
  "Sem registos neste período": ["No records in this period", "Sin registros en este periodo", "Keine Einträge in diesem Zeitraum", "Aucun enregistrement sur cette période"],
  "Sem serviços disponíveis": ["No services available", "Sin servicios disponibles", "Keine Dienste verfügbar", "Aucun service disponible"],
  "Sem tosquiadores disponíveis": ["No groomers available", "Sin peluqueros caninos disponibles", "Keine Hundefriseure verfügbar", "Aucun toiletteur disponible"],
  "Sem treinadores disponíveis": ["No trainers available", "Sin adiestradores disponibles", "Keine Trainer verfügbar", "Aucun éducateur disponible"],
  "Serviços": ["Services", "Servicios", "Leistungen", "Services"],
  "Serviços e preços": ["Services and prices", "Servicios y precios", "Leistungen und Preise", "Services et tarifs"],
  "Serviços especializados para o seu pet": ["Specialist services for your pet", "Servicios especializados para su mascota", "Spezialisierte Dienste für Ihr Tier", "Services spécialisés pour votre animal"],
  "Sim, cancelar": ["Yes, cancel", "Sí, cancelar", "Ja, abbrechen", "Oui, annuler"],
  "Sim, já está em casa": ["Yes, they're home", "Sí, ya está en casa", "Ja, es ist zu Hause", "Oui, il est rentré"],
  "Sobre os nossos conteúdos": ["About our content", "Sobre nuestros contenidos", "Über unsere Inhalte", "À propos de nos contenus"],
  "Telefone para marcações": ["Booking phone number", "Teléfono para citas", "Telefon für Terminvereinbarung", "Téléphone pour les rendez-vous"],
  "Tem a certeza que quer eliminar esta consulta?": ["Are you sure you want to delete this appointment?", "¿Seguro que quiere eliminar esta consulta?", "Möchten Sie diesen Termin wirklich löschen?", "Voulez-vous vraiment supprimer ce rendez-vous ?"],
  "Tem a certeza que quer sair?": ["Are you sure you want to sign out?", "¿Seguro que quiere cerrar sesión?", "Möchten Sie sich wirklich abmelden?", "Voulez-vous vraiment vous déconnecter ?"],
  "Tem a certeza?": ["Are you sure?", "¿Está seguro?", "Sind Sie sicher?", "Êtes-vous sûr ?"],
  "Tem a certeza? Esta ação não pode ser desfeita.": ["Are you sure? This action cannot be undone.", "¿Está seguro? Esta acción no se puede deshacer.", "Sind Sie sicher? Diese Aktion kann nicht rückgängig gemacht werden.", "Êtes-vous sûr ? Cette action est irréversible."],
  "Tipo de consulta": ["Appointment type", "Tipo de consulta", "Art des Termins", "Type de rendez-vous"],
  "Tipo de documento": ["Document type", "Tipo de documento", "Art des Dokuments", "Type de document"],
  "Tire uma foto às receitas do veterinário para as ter sempre à mão! 📱": ["Take a photo of the vet's prescriptions to always have them at hand! 📱", "¡Haga una foto de las recetas del veterinario para tenerlas siempre a mano! 📱", "Fotografieren Sie die Rezepte des Tierarztes, damit Sie sie immer zur Hand haben! 📱", "Prenez en photo les ordonnances du vétérinaire pour les avoir toujours sous la main ! 📱"],
  "Todos os documentos do seu bichinho organizadinhos! 📁🐾": ["All your pet's documents neatly organised! 📁🐾", "¡Todos los documentos de su mascota bien organizados! 📁🐾", "Alle Dokumente Ihres Tieres schön geordnet! 📁🐾", "Tous les documents de votre animal bien rangés ! 📁🐾"],
  "Trabalho social da PetsLife 🐾": ["PetsLife community work 🐾", "Labor social de PetsLife 🐾", "Soziales Engagement von PetsLife 🐾", "Action sociale de PetsLife 🐾"],
  "Treinadores profissionais para o seu pet": ["Professional trainers for your pet", "Adiestradores profesionales para su mascota", "Professionelle Trainer für Ihr Tier", "Éducateurs professionnels pour votre animal"],
  "Tudo em dia!": ["All up to date!", "¡Todo al día!", "Alles auf dem neuesten Stand!", "Tout est à jour !"],
  "Tudo o que o seu animal precisa": ["Everything your pet needs", "Todo lo que su mascota necesita", "Alles, was Ihr Tier braucht", "Tout ce dont votre animal a besoin"],
  "Título": ["Title", "Título", "Titel", "Titre"],
  "Título *": ["Title *", "Título *", "Titel *", "Titre *"],
  "Título / Medicamento *": ["Title / Medicine *", "Título / medicamento *", "Titel / Medikament *", "Titre / Médicament *"],
  "Título / Nome *": ["Title / Name *", "Título / nombre *", "Titel / Name *", "Titre / Nom *"],
  "Título da missão": ["Mission title", "Título de la misión", "Titel der Mission", "Titre de la mission"],
  "Vacina adicionada com sucesso.": ["Vaccine added successfully.", "Vacuna añadida con éxito.", "Impfung erfolgreich hinzugefügt.", "Vaccin ajouté avec succès."],
  "Variação": ["Change", "Variación", "Veränderung", "Variation"],
  "Ver Online": ["View Online", "Ver online", "Online ansehen", "Voir en ligne"],
  "Ver no Mapa": ["View on Map", "Ver en el mapa", "Auf der Karte ansehen", "Voir sur la carte"],
  "Ver vídeo no YouTube": ["Watch video on YouTube", "Ver vídeo en YouTube", "Video auf YouTube ansehen", "Voir la vidéo sur YouTube"],
  "Ver →": ["View →", "Ver →", "Ansehen →", "Voir →"],
  "Verifica a tua caixa de entrada e segue as instruções para redefinir a tua password.": ["Check your inbox and follow the instructions to reset your password.", "Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.", "Sieh in deinem Posteingang nach und folge der Anleitung, um dein Passwort zurückzusetzen.", "Consultez votre boîte de réception et suivez les instructions pour réinitialiser votre mot de passe."],
  "Veterinário": ["Vet", "Veterinario", "Tierarzt", "Vétérinaire"],
  "Vá ao separador de consultas e carregue no + para marcar a sua primeira consulta online.": ["Go to the appointments tab and tap + to book your first online appointment.", "Vaya a la pestaña de consultas y pulse + para reservar su primera consulta online.", "Gehen Sie zum Tab Termine und tippen Sie auf +, um Ihren ersten Online-Termin zu buchen.", "Allez dans l'onglet des rendez-vous et appuyez sur + pour réserver votre première consultation en ligne."],
  "email@exemplo.com": ["email@example.com", "correo@ejemplo.com", "email@beispiel.de", "email@exemple.com"],
  "esta publicação": ["this post", "esta publicación", "diesen Beitrag", "cette publication"],
  "este anúncio": ["this listing", "este anuncio", "diese Anzeige", "cette annonce"],
  "ex: Após consulta veterinária": ["e.g. After the vet appointment", "Ej.: Tras la consulta veterinaria", "z. B. nach dem Tierarztbesuch", "Ex. : Après la consultation vétérinaire"],
  "o.seu@email.com": ["your@email.com", "su@email.com", "ihre@email.de", "votre@email.com"],
  "o.teu@email.com": ["your@email.com", "tu@email.com", "deine@email.de", "ton@email.com"],
  "Área reservada": ["Restricted area", "Área reservada", "Geschützter Bereich", "Espace réservé"],
  "Ótimo! Nenhum relato de animal perdido por aqui.": ["Great! No lost pet reports around here.", "¡Genial! Ningún aviso de mascota perdida por aquí.", "Super! Keine Vermisstenmeldungen in der Nähe.", "Super ! Aucun signalement d'animal perdu par ici."],
  "€1.67/mês • Poupa 58%!": ["€1.67/month • Save 58%!", "1,67 €/mes • ¡Ahorra un 58 %!", "1,67 €/Monat • Spare 58 %!", "1,67 €/mois • Économisez 58 % !"],
  "▶ Vídeo": ["▶ Video", "▶ Vídeo", "▶ Video", "▶ Vidéo"],
  "⚕️ Atenção à Saúde": ["⚕️ Health Watch", "⚕️ Atención a la salud", "⚕️ Auf die Gesundheit achten", "⚕️ Attention à la santé"],
  "⚠️ Consulte sempre o seu veterinário antes de administrar qualquer medicamento ou suplemento ao seu animal.": ["⚠️ Always consult your vet before giving your pet any medicine or supplement.", "⚠️ Consulte siempre a su veterinario antes de administrar cualquier medicamento o suplemento a su mascota.", "⚠️ Fragen Sie immer Ihre Tierärztin oder Ihren Tierarzt, bevor Sie Ihrem Tier ein Medikament oder Ergänzungsmittel geben.", "⚠️ Consultez toujours votre vétérinaire avant de donner un médicament ou un complément à votre animal."],
  "✅ Avaliação enviada!": ["✅ Review sent!", "✅ ¡Valoración enviada!", "✅ Bewertung gesendet!", "✅ Avis envoyé !"],
  "✅ Negócio registado!": ["✅ Business registered!", "✅ ¡Negocio registrado!", "✅ Unternehmen registriert!", "✅ Entreprise enregistrée !"],
  "✅ O que fazer": ["✅ What to do", "✅ Qué hacer", "✅ Was tun", "✅ Ce qu'il faut faire"],
  "❌ Não fazer": ["❌ What not to do", "❌ Qué no hacer", "❌ Was nicht tun", "❌ Ce qu'il ne faut pas faire"],
  "🏠 Ideal para": ["🏠 Ideal for", "🏠 Ideal para", "🏠 Ideal für", "🏠 Idéal pour"],
  "💉 Nova Vacina": ["💉 New Vaccine", "💉 Nueva vacuna", "💉 Neue Impfung", "💉 Nouveau vaccin"],
  "💊 Nova Receita": ["💊 New Prescription", "💊 Nueva receta", "💊 Neues Rezept", "💊 Nouvelle ordonnance"],
  "💡 Após agendar, receberá um link de videochamada gratuito visível aqui na app. Pode partilhá-lo com o veterinário.": ["💡 After booking you'll get a free video call link shown here in the app. You can share it with the vet.", "💡 Tras reservar recibirá un enlace de videollamada gratuito visible aquí en la app. Puede compartirlo con el veterinario.", "💡 Nach der Buchung erhalten Sie einen kostenlosen Videoanruf-Link, der hier in der App zu sehen ist. Sie können ihn mit dem Tierarzt teilen.", "💡 Après la réservation, vous recevrez un lien de visioconférence gratuit visible ici dans l'application. Vous pouvez le partager avec le vétérinaire."],
  "💡 Dicas úteis": ["💡 Useful tips", "💡 Consejos útiles", "💡 Nützliche Tipps", "💡 Conseils utiles"],
  "💰 Preço indicativo": ["💰 Indicative price", "💰 Precio orientativo", "💰 Richtpreis", "💰 Prix indicatif"],
  "💾 Guardar Consulta": ["💾 Save Appointment", "💾 Guardar consulta", "💾 Termin speichern", "💾 Enregistrer le rendez-vous"],
  "💾 Guardar Registo": ["💾 Save Record", "💾 Guardar registro", "💾 Eintrag speichern", "💾 Enregistrer"],
  "💾 Guardar Vacina": ["💾 Save Vaccine", "💾 Guardar vacuna", "💾 Impfung speichern", "💾 Enregistrer le vaccin"],
  "📄 Novo Documento": ["📄 New Document", "📄 Nuevo documento", "📄 Neues Dokument", "📄 Nouveau document"],
  "📅 Nova Consulta": ["📅 New Appointment", "📅 Nueva consulta", "📅 Neuer Termin", "📅 Nouveau rendez-vous"],
  "📋 Descrição": ["📋 Description", "📋 Descripción", "📋 Beschreibung", "📋 Description"],
  "📓 Nova Entrada": ["📓 New Entry", "📓 Nueva entrada", "📓 Neuer Eintrag", "📓 Nouvelle entrée"],
  "📱 Android: Definições → Apps → Chrome → Permissões → Câmara e Microfone": ["📱 Android: Settings → Apps → Chrome → Permissions → Camera and Microphone", "📱 Android: Ajustes → Apps → Chrome → Permisos → Cámara y micrófono", "📱 Android: Einstellungen → Apps → Chrome → Berechtigungen → Kamera und Mikrofon", "📱 Android : Paramètres → Applications → Chrome → Autorisations → Caméra et micro"],
  "📱 iPhone: Definições → Safari → Câmara e Microfone → Perguntar": ["📱 iPhone: Settings → Safari → Camera and Microphone → Ask", "📱 iPhone: Ajustes → Safari → Cámara y micrófono → Preguntar", "📱 iPhone: Einstellungen → Safari → Kamera und Mikrofon → Fragen", "📱 iPhone : Réglages → Safari → Caméra et micro → Demander"],
  "📷 Foto / Scan do documento": ["📷 Photo / scan of the document", "📷 Foto / escaneo del documento", "📷 Foto / Scan des Dokuments", "📷 Photo / scan du document"],
  "📷 Foto da receita": ["📷 Photo of the prescription", "📷 Foto de la receta", "📷 Foto des Rezepts", "📷 Photo de l'ordonnance"],
  "🔍 Animais Perdidos": ["🔍 Lost Pets", "🔍 Mascotas perdidas", "🔍 Vermisste Tiere", "🔍 Animaux perdus"],
  "🚨 Ligar Vet Emergência 24h": ["🚨 Call 24h Emergency Vet", "🚨 Llamar veterinario de urgencias 24h", "🚨 24h-Notdienst anrufen", "🚨 Appeler le vétérinaire d'urgence 24h"],
  "🚨 Urgência Veterinária": ["🚨 Veterinary Emergency", "🚨 Urgencia veterinaria", "🚨 Tierärztlicher Notfall", "🚨 Urgence vétérinaire"],
  "🪱 Nova Desparasitação": ["🪱 New Deworming", "🪱 Nueva desparasitación", "🪱 Neue Entwurmung", "🪱 Nouvelle vermifugation"],
};

// ── Selector de idioma ────────────────────────────────────────────────
T["Idioma"] = ["Language", "Idioma", "Sprache", "Langue"];
T["Escolha o seu idioma preferido"] = ["Choose your preferred language", "Elija su idioma preferido", "Wählen Sie Ihre Sprache", "Choisissez votre langue"];

// ── Segundo lote: palavras curtas e botões ────────────────────────────
T["+ Primeira entrada"] = ["+ First entry", "+ Primera entrada", "+ Erster Eintrag", "+ Première entrée"];
T["+ Registar peso"] = ["+ Add weight", "+ Registrar peso", "+ Gewicht eintragen", "+ Ajouter un poids"];
T["/ano"] = ["/year", "/año", "/Jahr", "/an"];
T["/mês"] = ["/month", "/mes", "/Monat", "/mois"];
T["A denúncia foi enviada. A equipa vai analisar e tomar as medidas necessárias."] = ["The report has been sent. Our team will review it and take action.", "La denuncia se ha enviado. El equipo la revisará y tomará medidas.", "Die Meldung wurde gesendet. Das Team prüft sie und ergreift Maßnahmen.", "Le signalement a été envoyé. L'équipe va l'examiner et agir."];
T["Abrir no Google Maps"] = ["Open in Google Maps", "Abrir en Google Maps", "In Google Maps öffnen", "Ouvrir dans Google Maps"];
T["Agendar consulta"] = ["Book appointment", "Reservar consulta", "Termin buchen", "Prendre rendez-vous"];
T["Ainda sem mensagens"] = ["No messages yet", "Todavía sin mensajes", "Noch keine Nachrichten", "Pas encore de messages"];
T["Anual"] = ["Yearly", "Anual", "Jährlich", "Annuel"];
T["Atual"] = ["Current", "Actual", "Aktuell", "Actuel"];
T["Avaliar"] = ["Rate", "Valorar", "Bewerten", "Évaluer"];
T["Caderneta / Comprovativo"] = ["Record book / proof", "Cartilla / comprobante", "Impfpass / Nachweis", "Carnet / justificatif"];
T["Cancelar"] = ["Cancel", "Cancelar", "Abbrechen", "Annuler"];
T["Cancele quando quiser. Sem compromisso."] = ["Cancel any time. No commitment.", "Cancele cuando quiera. Sin compromiso.", "Jederzeit kündbar. Ohne Verpflichtung.", "Annulez quand vous voulez. Sans engagement."];
T["Carregue em «Usar esta foto» para a guardar."] = ["Tap \"Use this photo\" to save it.", "Pulse «Usar esta foto» para guardarla.", "Tippen Sie auf \"Dieses Foto verwenden\", um es zu speichern.", "Appuyez sur « Utiliser cette photo » pour l'enregistrer."];
T["Carregue em «Usar esta foto» para a guardar. Se não for esta, pode escolher outra."] = ["Tap \"Use this photo\" to save it. If it's not the right one, pick another.", "Pulse «Usar esta foto» para guardarla. Si no es esta, puede elegir otra.", "Tippen Sie auf \"Dieses Foto verwenden\", um es zu speichern. Wenn es nicht passt, wählen Sie ein anderes.", "Appuyez sur « Utiliser cette photo » pour l'enregistrer. Sinon, choisissez-en une autre."];
T["Categoria"] = ["Category", "Categoría", "Kategorie", "Catégorie"];
T["Categoria *"] = ["Category *", "Categoría *", "Kategorie *", "Catégorie *"];
T["Cidade"] = ["City", "Ciudad", "Stadt", "Ville"];
T["Como funciona?"] = ["How does it work?", "¿Cómo funciona?", "Wie funktioniert das?", "Comment ça marche ?"];
T["Comunidade"] = ["Community", "Comunidad", "Community", "Communauté"];
T["Consulta"] = ["Appointment", "Consulta", "Termin", "Rendez-vous"];
T["Consulta Online"] = ["Online Appointment", "Consulta online", "Online-Termin", "Consultation en ligne"];
T["Consultas"] = ["Appointments", "Consultas", "Termine", "Rendez-vous"];
T["Contacto"] = ["Contact", "Contacto", "Kontakt", "Contact"];
T["Contactos"] = ["Contacts", "Contactos", "Kontakte", "Contacts"];
T["Criar parceiro"] = ["Create partner", "Crear socio", "Partner anlegen", "Créer un partenaire"];
T["Criar primeiro lembrete"] = ["Create first reminder", "Crear el primer recordatorio", "Erste Erinnerung erstellen", "Créer le premier rappel"];
T["DD/MM/AAAA"] = ["DD/MM/YYYY", "DD/MM/AAAA", "TT.MM.JJJJ", "JJ/MM/AAAA"];
T["Data"] = ["Date", "Fecha", "Datum", "Date"];
T["Data *"] = ["Date *", "Fecha *", "Datum *", "Date *"];
T["Denunciar conteúdo"] = ["Report content", "Denunciar contenido", "Inhalt melden", "Signaler le contenu"];
T["Documentos"] = ["Documents", "Documentos", "Dokumente", "Documents"];
T["Editar Perfil"] = ["Edit Profile", "Editar perfil", "Profil bearbeiten", "Modifier le profil"];
T["Editar consulta"] = ["Edit appointment", "Editar consulta", "Termin bearbeiten", "Modifier le rendez-vous"];
T["Editar perfil"] = ["Edit profile", "Editar perfil", "Profil bearbeiten", "Modifier le profil"];
T["Eliminar"] = ["Delete", "Eliminar", "Löschen", "Supprimer"];
T["Eliminar consulta"] = ["Delete appointment", "Eliminar consulta", "Termin löschen", "Supprimer le rendez-vous"];
T["Email enviado!"] = ["Email sent!", "¡Email enviado!", "E-Mail gesendet!", "E-mail envoyé !"];
T["Email ou telefone"] = ["Email or phone", "Email o teléfono", "E-Mail oder Telefon", "E-mail ou téléphone"];
T["Entrar"] = ["Sign in", "Entrar", "Anmelden", "Se connecter"];
T["Entrar agora"] = ["Sign in now", "Entrar ahora", "Jetzt anmelden", "Se connecter maintenant"];
T["Entrar na chamada"] = ["Join call", "Entrar en la llamada", "Anruf beitreten", "Rejoindre l'appel"];
T["Enviar link"] = ["Send link", "Enviar enlace", "Link senden", "Envoyer le lien"];
T["Escolher ficheiro"] = ["Choose file", "Elegir archivo", "Datei wählen", "Choisir un fichier"];
T["Especialidade"] = ["Speciality", "Especialidad", "Fachgebiet", "Spécialité"];
T["Ex: 1 comprimido, 5ml, 2 gotas"] = ["e.g. 1 tablet, 5ml, 2 drops", "Ej.: 1 comprimido, 5 ml, 2 gotas", "z. B. 1 Tablette, 5 ml, 2 Tropfen", "Ex. : 1 comprimé, 5 ml, 2 gouttes"];
T["Ex: 40k seguidores Instagram"] = ["e.g. 40k Instagram followers", "Ej.: 40k seguidores en Instagram", "z. B. 40k Instagram-Follower", "Ex. : 40k abonnés Instagram"];
T["Ex: Amoxicilina, Pomada, Antipulgas"] = ["e.g. Amoxicillin, ointment, flea treatment", "Ej.: Amoxicilina, pomada, antipulgas", "z. B. Amoxicillin, Salbe, Flohmittel", "Ex. : Amoxicilline, pommade, antipuces"];
T["Ex: Bola, Luna..."] = ["e.g. Buddy, Luna...", "Ej.: Bola, Luna...", "z. B. Bella, Luna...", "Ex. : Bella, Luna..."];
T["Ex: Brincou muito hoje! 🎉"] = ["e.g. Played a lot today! 🎉", "Ej.: ¡Hoy ha jugado mucho! 🎉", "z. B. Hat heute viel gespielt! 🎉", "Ex. : A beaucoup joué aujourd'hui ! 🎉"];
T["Ex: Consulta anual"] = ["e.g. Annual appointment", "Ej.: Consulta anual", "z. B. Jahrestermin", "Ex. : Consultation annuelle"];
T["Ex: Consulta geral €25, Vacina €15, Tosquia €30..."] = ["e.g. General consultation €25, vaccine €15, grooming €30...", "Ej.: Consulta general 25 €, vacuna 15 €, peluquería 30 €...", "z. B. Allgemeine Untersuchung 25 €, Impfung 15 €, Fellpflege 30 €...", "Ex. : Consultation 25 €, vaccin 15 €, toilettage 30 €..."];
T["Ex: Frontline, Milbemax, Advocate..."] = ["e.g. Frontline, Milbemax, Advocate...", "Ej.: Frontline, Milbemax, Advocate...", "z. B. Frontline, Milbemax, Advocate...", "Ex. : Frontline, Milbemax, Advocate..."];
T["Ex: JOAO10"] = ["e.g. JOHN10", "Ej.: JUAN10", "z. B. JAN10", "Ex. : JEAN10"];
T["Ex: Lisboa"] = ["e.g. London", "Ej.: Madrid", "z. B. Berlin", "Ex. : Paris"];
T["Ex: Passaporte Europeu..."] = ["e.g. European passport...", "Ej.: Pasaporte europeo...", "z. B. EU-Heimtierausweis...", "Ex. : Passeport européen..."];
T["Ex: Stronghold, Advantage..."] = ["e.g. Stronghold, Advantage...", "Ej.: Stronghold, Advantage...", "z. B. Stronghold, Advantage...", "Ex. : Stronghold, Advantage..."];
T["Ex: Tosse persistente"] = ["e.g. Persistent cough", "Ej.: Tos persistente", "z. B. anhaltender Husten", "Ex. : Toux persistante"];
T["Explorar"] = ["Explore", "Explorar", "Entdecken", "Explorer"];
T["Fechar"] = ["Close", "Cerrar", "Schließen", "Fermer"];
T["Ferramentas"] = ["Tools", "Herramientas", "Werkzeuge", "Outils"];
T["Galeria"] = ["Gallery", "Galería", "Galerie", "Galerie"];
T["Guia"] = ["Guide", "Guía", "Leitfaden", "Guide"];
T["Hoje"] = ["Today", "Hoy", "Heute", "Aujourd'hui"];
T["Hora"] = ["Time", "Hora", "Uhrzeit", "Heure"];
T["Horas"] = ["Times", "Horas", "Uhrzeiten", "Heures"];
T["Lembretes"] = ["Reminders", "Recordatorios", "Erinnerungen", "Rappels"];
T["Ligar"] = ["Call", "Llamar", "Anrufen", "Appeler"];
T["Ligar 112"] = ["Call 112", "Llamar al 112", "112 anrufen", "Appeler le 112"];
T["Limpar"] = ["Clear", "Borrar", "Löschen", "Effacer"];
T["MELHOR VALOR"] = ["BEST VALUE", "MEJOR PRECIO", "BESTES ANGEBOT", "MEILLEUR PRIX"];
T["Marcar Consulta"] = ["Book Appointment", "Pedir cita", "Termin buchen", "Prendre rendez-vous"];
T["Marketplace"] = ["Marketplace", "Marketplace", "Marktplatz", "Marketplace"];
T["Mensagens"] = ["Messages", "Mensajes", "Nachrichten", "Messages"];
T["Mensal"] = ["Monthly", "Mensual", "Monatlich", "Mensuel"];
T["Morada"] = ["Address", "Dirección", "Adresse", "Adresse"];
T["Motivo *"] = ["Reason *", "Motivo *", "Grund *", "Motif *"];
T["Motivo / Notas"] = ["Reason / Notes", "Motivo / notas", "Grund / Notizen", "Motif / Notes"];
T["Nenhum registo ainda"] = ["No records yet", "Todavía sin registros", "Noch keine Einträge", "Aucun enregistrement"];
T["Nenhuma consulta agendada"] = ["No appointments booked", "Ninguna consulta reservada", "Keine Termine gebucht", "Aucun rendez-vous prévu"];
T["Nenhuma consulta registada."] = ["No appointments recorded.", "No hay consultas registradas.", "Keine Termine erfasst.", "Aucun rendez-vous enregistré."];
T["Notas"] = ["Notes", "Notas", "Notizen", "Notes"];
T["Notas / Motivo"] = ["Notes / Reason", "Notas / motivo", "Notizen / Grund", "Notes / Motif"];
T["Notas / Posologia"] = ["Notes / Dosage", "Notas / posología", "Notizen / Dosierung", "Notes / Posologie"];
T["Notas / Resultados"] = ["Notes / Results", "Notas / resultados", "Notizen / Ergebnisse", "Notes / Résultats"];
T["Nº Microchip"] = ["Microchip no.", "N.º de microchip", "Mikrochip-Nr.", "N° de puce"];
T["Obrigado"] = ["Thank you", "Gracias", "Danke", "Merci"];
T["Outro ficheiro"] = ["Another file", "Otro archivo", "Andere Datei", "Autre fichier"];
T["PDF, imagem..."] = ["PDF, image...", "PDF, imagen...", "PDF, Bild...", "PDF, image..."];
T["Parceiros"] = ["Partners", "Socios", "Partner", "Partenaires"];
T["Partilhar"] = ["Share", "Compartir", "Teilen", "Partager"];
T["Password"] = ["Password", "Contraseña", "Passwort", "Mot de passe"];
T["Perfil"] = ["Profile", "Perfil", "Profil", "Profil"];
T["Perguntas frequentes"] = ["Frequently asked questions", "Preguntas frecuentes", "Häufige Fragen", "Questions fréquentes"];
T["Permissão necessária 📷"] = ["Permission needed 📷", "Permiso necesario 📷", "Berechtigung nötig 📷", "Autorisation requise 📷"];
T["Peso"] = ["Weight", "Peso", "Gewicht", "Poids"];
T["Peso atual"] = ["Current weight", "Peso actual", "Aktuelles Gewicht", "Poids actuel"];
T["Pesquisar petshops..."] = ["Search pet shops...", "Buscar tiendas de mascotas...", "Tierläden suchen...", "Rechercher des animaleries..."];
T["Pesquisar produto..."] = ["Search product...", "Buscar producto...", "Produkt suchen...", "Rechercher un produit..."];
T["Pesquisar tosquiadores..."] = ["Search groomers...", "Buscar peluqueros caninos...", "Hundefriseure suchen...", "Rechercher des toiletteurs..."];
T["Pesquisar treinadores..."] = ["Search trainers...", "Buscar adiestradores...", "Trainer suchen...", "Rechercher des éducateurs..."];
T["Petshops"] = ["Pet shops", "Tiendas de mascotas", "Tierläden", "Animaleries"];
T["Planos PetsLife"] = ["PetsLife plans", "Planes PetsLife", "PetsLife-Tarife", "Formules PetsLife"];
T["Precisamos de acesso à câmara para tirar uma foto."] = ["We need camera access to take a photo.", "Necesitamos acceso a la cámara para hacer una foto.", "Wir brauchen Kamerazugriff, um ein Foto zu machen.", "Nous avons besoin d'accéder à l'appareil photo."];
T["Precisamos de acesso à galeria para escolher uma foto."] = ["We need gallery access to choose a photo.", "Necesitamos acceso a la galería para elegir una foto.", "Wir brauchen Zugriff auf die Galerie, um ein Foto zu wählen.", "Nous avons besoin d'accéder à la galerie."];
T["Primeiros Socorros 🩺"] = ["First Aid 🩺", "Primeros auxilios 🩺", "Erste Hilfe 🩺", "Premiers secours 🩺"];
T["Produto *"] = ["Product *", "Producto *", "Produkt *", "Produit *"];
T["Publicar"] = ["Post", "Publicar", "Veröffentlichen", "Publier"];
T["Qual é o motivo?"] = ["What's the reason?", "¿Cuál es el motivo?", "Was ist der Grund?", "Quel est le motif ?"];
T["Receitas"] = ["Prescriptions", "Recetas", "Rezepte", "Ordonnances"];
T["Recuperar password"] = ["Reset password", "Recuperar contraseña", "Passwort zurücksetzen", "Réinitialiser le mot de passe"];
T["Registar Peso"] = ["Add Weight", "Registrar peso", "Gewicht eintragen", "Ajouter un poids"];
T["Registe sintomas, comportamentos e mais"] = ["Record symptoms, behaviour and more", "Registre síntomas, comportamientos y más", "Symptome, Verhalten und mehr erfassen", "Notez symptômes, comportements et plus"];
T["Remover"] = ["Remove", "Quitar", "Entfernen", "Retirer"];
T["Remover imagem"] = ["Remove image", "Quitar imagen", "Bild entfernen", "Retirer l'image"];
T["Renovar"] = ["Renew", "Renovar", "Verlängern", "Renouveler"];
T["Resgates recentes"] = ["Recent redemptions", "Canjes recientes", "Aktuelle Einlösungen", "Utilisations récentes"];
T["Sem consultas"] = ["No appointments", "Sin consultas", "Keine Termine", "Aucun rendez-vous"];
T["Sem documentos"] = ["No documents", "Sin documentos", "Keine Dokumente", "Aucun document"];
T["Sem lembretes"] = ["No reminders", "Sin recordatorios", "Keine Erinnerungen", "Aucun rappel"];
T["Sem permissão"] = ["No permission", "Sin permiso", "Keine Berechtigung", "Pas d'autorisation"];
T["Sem petshops encontradas"] = ["No pet shops found", "No se han encontrado tiendas", "Keine Tierläden gefunden", "Aucune animalerie trouvée"];
T["Sem receitas"] = ["No prescriptions", "Sin recetas", "Keine Rezepte", "Aucune ordonnance"];
T["Sem registos"] = ["No records", "Sin registros", "Keine Einträge", "Aucun enregistrement"];
T["Sem vacinas ainda"] = ["No vaccines yet", "Todavía sin vacunas", "Noch keine Impfungen", "Pas encore de vaccins"];
T["Sexo"] = ["Sex", "Sexo", "Geschlecht", "Sexe"];
T["Só o autor do conteúdo ou a administração podem apagar."] = ["Only the author or the admin team can delete it.", "Solo el autor del contenido o la administración pueden eliminarlo.", "Nur die Autorin bzw. der Autor oder die Administration können löschen.", "Seul l'auteur du contenu ou l'administration peut le supprimer."];
T["Telefone"] = ["Phone", "Teléfono", "Telefon", "Téléphone"];
T["Tentar"] = ["Try", "Intentar", "Versuchen", "Essayer"];
T["Tentar continuar"] = ["Try to continue", "Intentar continuar", "Weiter versuchen", "Essayer de continuer"];
T["Tentar outra vez"] = ["Try again", "Intentar de nuevo", "Erneut versuchen", "Réessayer"];
T["Testar videochamada agora"] = ["Test video call now", "Probar la videollamada ahora", "Videoanruf jetzt testen", "Tester la visioconférence"];
T["Tipo"] = ["Type", "Tipo", "Art", "Type"];
T["Tipo *"] = ["Type *", "Tipo *", "Art *", "Type *"];
T["Tosquiadores"] = ["Groomers", "Peluqueros caninos", "Hundefriseure", "Toiletteurs"];
T["Treino & Adestramento"] = ["Training", "Adiestramiento", "Training", "Éducation"];
T["Treino & Comportamento 🎯"] = ["Training & Behaviour 🎯", "Adiestramiento y conducta 🎯", "Training & Verhalten 🎯", "Éducation et comportement 🎯"];
T["Trocar ficheiro"] = ["Change file", "Cambiar archivo", "Datei ändern", "Changer de fichier"];
T["Usar esta foto?"] = ["Use this photo?", "¿Usar esta foto?", "Dieses Foto verwenden?", "Utiliser cette photo ?"];
T["Utilizador"] = ["User", "Usuario", "Nutzer", "Utilisateur"];
T["Vacinas"] = ["Vaccines", "Vacunas", "Impfungen", "Vaccins"];
T["Ver planos"] = ["See plans", "Ver planes", "Tarife ansehen", "Voir les formules"];
T["Ver planos e renovar"] = ["See plans and renew", "Ver planes y renovar", "Tarife ansehen und verlängern", "Voir les formules et renouveler"];
T["Vets e Outros"] = ["Vets & More", "Veterinarios y más", "Tierärzte & mehr", "Vétos et plus"];
T["Voltar"] = ["Back", "Volver", "Zurück", "Retour"];
T["Voltar ao login"] = ["Back to sign in", "Volver al inicio de sesión", "Zurück zur Anmeldung", "Retour à la connexion"];
T["Website"] = ["Website", "Sitio web", "Webseite", "Site web"];
T["● Online"] = ["● Online", "● En línea", "● Online", "● En ligne"];
T["⚖️ Registar Peso"] = ["⚖️ Add Weight", "⚖️ Registrar peso", "⚖️ Gewicht eintragen", "⚖️ Ajouter un poids"];
T["✅ Consulta agendada!"] = ["✅ Appointment booked!", "✅ ¡Consulta reservada!", "✅ Termin gebucht!", "✅ Rendez-vous confirmé !"];
T["✨ Personalidade"] = ["✨ Personality", "✨ Personalidad", "✨ Wesen", "✨ Caractère"];
T["🎉 Encontrados"] = ["🎉 Found", "🎉 Encontrados", "🎉 Gefunden", "🎉 Retrouvés"];
T["💡 Dica Importante"] = ["💡 Important tip", "💡 Consejo importante", "💡 Wichtiger Tipp", "💡 Conseil important"];
T["📅 Marcar Consulta"] = ["📅 Book Appointment", "📅 Pedir cita", "📅 Termin buchen", "📅 Prendre rendez-vous"];
T["📋 Passos"] = ["📋 Steps", "📋 Pasos", "📋 Schritte", "📋 Étapes"];
T["📎 Comprovativo"] = ["📎 Proof", "📎 Comprobante", "📎 Nachweis", "📎 Justificatif"];
T["😢 Perdidos"] = ["😢 Lost", "😢 Perdidos", "😢 Vermisst", "😢 Perdus"];
T["🛁 Cuidados"] = ["🛁 Care", "🛁 Cuidados", "🛁 Pflege", "🛁 Soins"];
T["Início"] = ["Home", "Inicio", "Start", "Accueil"];
T["Guardar Foto"] = ["Save Photo", "Guardar foto", "Foto speichern", "Enregistrer la photo"];
T["Erro"] = ["Error", "Error", "Fehler", "Erreur"];
T["Sucesso"] = ["Success", "Correcto", "Erfolg", "Succès"];
T["Sim"] = ["Yes", "Sí", "Ja", "Oui"];
T["OK"] = ["OK", "OK", "OK", "OK"];


// Conteúdo dos guias (Primeiros Socorros, Farmácia, Adestramento, Raças).
// Fica em ficheiro separado só por tamanho; junta-se aqui ao catálogo principal.
import { GUIAS } from "./catalog-guias";
Object.assign(T, GUIAS);

// Frases soltas dos ecrãs (vets, videochamada, missões, documentos...).
import { ECRAS } from "./catalog-ecras";
Object.assign(T, ECRAS);
