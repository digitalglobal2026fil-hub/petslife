/**
 * Catálogo de traduções da PetsLife.
 *
 * A chave é a frase em português de Portugal, tal como aparece no ecrã.
 * A ordem dos valores é sempre: [en, es, de, fr, br]
 *
 * Se faltar uma frase aqui, a app mostra o português — nunca um código.
 */
export const ORDER = ["en", "es", "de", "fr", "br"] as const;

export const T: Record<string, readonly [string, string, string, string, string]> = {
  // ── Botões de adicionar ───────────────────────────────────────────────
  "+ Adicionar": ["+ Add", "+ Añadir", "+ Hinzufügen", "+ Ajouter", "+ Adicionar"],
  "+ Adicionar animal": ["+ Add pet", "+ Añadir mascota", "+ Tier hinzufügen", "+ Ajouter un animal", "+ Adicionar animal"],
  "+ Adicionar animal primeiro": ["+ Add a pet first", "+ Añade una mascota primero", "+ Zuerst ein Tier hinzufügen", "+ Ajoutez d'abord un animal", "+ Adicionar animal primeiro"],
  "+ Adicionar consulta": ["+ Add appointment", "+ Añadir consulta", "+ Termin hinzufügen", "+ Ajouter un rendez-vous", "+ Adicionar consulta"],
  "+ Adicionar documento": ["+ Add document", "+ Añadir documento", "+ Dokument hinzufügen", "+ Ajouter un document", "+ Adicionar documento"],
  "+ Adicionar receita": ["+ Add prescription", "+ Añadir receta", "+ Rezept hinzufügen", "+ Ajouter une ordonnance", "+ Adicionar receita"],
  "+ Adicionar registo": ["+ Add record", "+ Añadir registro", "+ Eintrag hinzufügen", "+ Ajouter un enregistrement", "+ Adicionar registro"],
  "+ Adicionar vacina": ["+ Add vaccine", "+ Añadir vacuna", "+ Impfung hinzufügen", "+ Ajouter un vaccin", "+ Adicionar vacina"],
  "+ Publicar Anúncio": ["+ Post listing", "+ Publicar anuncio", "+ Anzeige aufgeben", "+ Publier une annonce", "+ Publicar anúncio"],
  "+ Registar Negócio": ["+ Register business", "+ Registrar negocio", "+ Unternehmen anmelden", "+ Enregistrer une entreprise", "+ Cadastrar negócio"],

  // ── Estados de carregamento ───────────────────────────────────────────
  "A carregar foto...": ["Uploading photo...", "Subiendo foto...", "Foto wird hochgeladen...", "Envoi de la photo...", "Carregando foto..."],
  "A carregar foto... 📤": ["Uploading photo... 📤", "Subiendo foto... 📤", "Foto wird hochgeladen... 📤", "Envoi de la photo... 📤", "Carregando foto... 📤"],
  "A carregar...": ["Loading...", "Cargando...", "Wird geladen...", "Chargement...", "Carregando..."],
  "A carregar... 📤": ["Loading... 📤", "Cargando... 📤", "Wird geladen... 📤", "Chargement... 📤", "Carregando... 📤"],
  "A fazer upload...": ["Uploading...", "Subiendo...", "Wird hochgeladen...", "Téléversement...", "Enviando..."],
  "🐾 A carregar...": ["🐾 Loading...", "🐾 Cargando...", "🐾 Wird geladen...", "🐾 Chargement...", "🐾 Carregando..."],
  "Só um instante, quase lá...": ["Just a moment, almost there...", "Un momento, ya casi...", "Einen Moment, fast geschafft...", "Un instant, presque fini...", "Só um instante, quase lá..."],

  // ── Validações e mensagens ────────────────────────────────────────────
  "A descrição é obrigatória.": ["Description is required.", "La descripción es obligatoria.", "Beschreibung ist erforderlich.", "La description est obligatoire.", "A descrição é obrigatória."],
  "A password deve ter pelo menos 8 caracteres.": ["Password must be at least 8 characters.", "La contraseña debe tener al menos 8 caracteres.", "Das Passwort muss mindestens 8 Zeichen haben.", "Le mot de passe doit contenir au moins 8 caractères.", "A senha deve ter pelo menos 8 caracteres."],
  "Campo obrigatório": ["Required field", "Campo obligatorio", "Pflichtfeld", "Champ obligatoire", "Campo obrigatório"],
  "Campos obrigatórios": ["Required fields", "Campos obligatorios", "Pflichtfelder", "Champs obligatoires", "Campos obrigatórios"],
  "O nome é obrigatório.": ["Name is required.", "El nombre es obligatorio.", "Der Name ist erforderlich.", "Le nom est obligatoire.", "O nome é obrigatório."],
  "O título é obrigatório.": ["Title is required.", "El título es obligatorio.", "Der Titel ist erforderlich.", "Le titre est obligatoire.", "O título é obrigatório."],
  "Nome é obrigatório": ["Name is required", "El nombre es obligatorio", "Name ist erforderlich", "Le nom est obligatoire", "Nome é obrigatório"],
  "Título é obrigatório": ["Title is required", "El título es obligatorio", "Titel ist erforderlich", "Le titre est obligatoire", "Título é obrigatório"],
  "Motivo é obrigatório": ["Reason is required", "El motivo es obligatorio", "Grund ist erforderlich", "Le motif est obligatoire", "Motivo é obrigatório"],
  "Produto é obrigatório": ["Product is required", "El producto es obligatorio", "Produkt ist erforderlich", "Le produit est obligatoire", "Produto é obrigatório"],
  "Preencha todos os campos.": ["Please fill in all fields.", "Rellene todos los campos.", "Bitte alle Felder ausfüllen.", "Veuillez remplir tous les champs.", "Preencha todos os campos."],
  "Por favor preencha a data e hora.": ["Please fill in the date and time.", "Rellene la fecha y la hora.", "Bitte Datum und Uhrzeit ausfüllen.", "Veuillez indiquer la date et l'heure.", "Por favor preencha a data e hora."],
  "Insere um peso válido em kg": ["Enter a valid weight in kg", "Introduce un peso válido en kg", "Gültiges Gewicht in kg eingeben", "Saisissez un poids valide en kg", "Insira um peso válido em kg"],
  "Insira um peso válido": ["Enter a valid weight", "Introduzca un peso válido", "Gültiges Gewicht eingeben", "Saisissez un poids valide", "Insira um peso válido"],
  "Insira a data da consulta.": ["Enter the appointment date.", "Introduzca la fecha de la consulta.", "Termindatum eingeben.", "Saisissez la date du rendez-vous.", "Insira a data da consulta."],
  "Insira o motivo da consulta.": ["Enter the reason for the appointment.", "Introduzca el motivo de la consulta.", "Grund für den Termin eingeben.", "Saisissez le motif du rendez-vous.", "Insira o motivo da consulta."],
  "Insira o nome da vacina.": ["Enter the vaccine name.", "Introduzca el nombre de la vacuna.", "Impfstoffnamen eingeben.", "Saisissez le nom du vaccin.", "Insira o nome da vacina."],
  "Insira o título do documento.": ["Enter the document title.", "Introduzca el título del documento.", "Dokumenttitel eingeben.", "Saisissez le titre du document.", "Insira o título do documento."],
  "Insira um título para o registo.": ["Enter a title for the record.", "Introduzca un título para el registro.", "Titel für den Eintrag eingeben.", "Saisissez un titre pour l'enregistrement.", "Insira um título para o registro."],
  "Escreva um título para a missão.": ["Write a title for the mission.", "Escriba un título para la misión.", "Titel für die Mission eingeben.", "Écrivez un titre pour la mission.", "Escreva um título para a missão."],
  "Escreve o nome da medicação ou tratamento.": ["Enter the medication or treatment name.", "Escribe el nombre de la medicación o tratamiento.", "Namen des Medikaments oder der Behandlung eingeben.", "Saisissez le nom du médicament ou du traitement.", "Escreva o nome da medicação ou tratamento."],
  "Escreve o nome do parceiro.": ["Enter the partner's name.", "Escribe el nombre del socio.", "Namen des Partners eingeben.", "Saisissez le nom du partenaire.", "Escreva o nome do parceiro."],
  "Introduz o teu email.": ["Enter your email.", "Introduce tu correo.", "Gib deine E-Mail ein.", "Saisissez votre e-mail.", "Digite seu e-mail."],
  "Introduz um código primeiro.": ["Enter a code first.", "Introduce un código primero.", "Zuerst einen Code eingeben.", "Saisissez d'abord un code.", "Digite um código primeiro."],
  "Falta o título": ["Title missing", "Falta el título", "Titel fehlt", "Titre manquant", "Falta o título"],
  "Selecione um animal": ["Select a pet", "Seleccione una mascota", "Tier auswählen", "Sélectionnez un animal", "Selecione um animal"],
  "Escolha a qual animal pertence esta consulta.": ["Choose which pet this appointment belongs to.", "Elija a qué mascota pertenece esta consulta.", "Wählen Sie, zu welchem Tier dieser Termin gehört.", "Choisissez à quel animal appartient ce rendez-vous.", "Escolha a qual animal pertence esta consulta."],
  "Escolha a qual animal pertence esta vacina.": ["Choose which pet this vaccine belongs to.", "Elija a qué mascota pertenece esta vacuna.", "Wählen Sie, zu welchem Tier diese Impfung gehört.", "Choisissez à quel animal appartient ce vaccin.", "Escolha a qual animal pertence esta vacina."],
  "Escolha a qual animal pertence este registo.": ["Choose which pet this record belongs to.", "Elija a qué mascota pertenece este registro.", "Wählen Sie, zu welchem Tier dieser Eintrag gehört.", "Choisissez à quel animal appartient cet enregistrement.", "Escolha a qual animal pertence este registro."],
  "Escolha a data da consulta (dia/mês/ano).": ["Choose the appointment date (day/month/year).", "Elija la fecha de la consulta (día/mes/año).", "Termindatum wählen (Tag/Monat/Jahr).", "Choisissez la date du rendez-vous (jour/mois/année).", "Escolha a data da consulta (dia/mês/ano)."],
  "Indique a data de início no formato dia/mês/ano.": ["Enter the start date as day/month/year.", "Indique la fecha de inicio en formato día/mes/año.", "Startdatum im Format Tag/Monat/Jahr angeben.", "Indiquez la date de début au format jour/mois/année.", "Indique a data de início no formato dia/mês/ano."],
  "Hora em formato 24h — ex: 14:30": ["Time in 24h format — e.g. 14:30", "Hora en formato 24h — ej: 14:30", "Uhrzeit im 24-Stunden-Format — z. B. 14:30", "Heure au format 24 h — ex. : 14:30", "Hora em formato 24h — ex: 14:30"],
  "Hora inválida. Use o formato HH:MM (ex: 14:30).": ["Invalid time. Use HH:MM format (e.g. 14:30).", "Hora no válida. Use el formato HH:MM (ej: 14:30).", "Ungültige Uhrzeit. Format HH:MM verwenden (z. B. 14:30).", "Heure invalide. Utilisez le format HH:MM (ex. : 14:30).", "Hora inválida. Use o formato HH:MM (ex: 14:30)."],
  "Ficheiro necessário": ["File required", "Archivo necesario", "Datei erforderlich", "Fichier requis", "Arquivo necessário"],
  "Por favor adicione uma foto ou ficheiro": ["Please add a photo or file", "Añada una foto o archivo", "Bitte ein Foto oder eine Datei hinzufügen", "Veuillez ajouter une photo ou un fichier", "Por favor adicione uma foto ou arquivo"],
  "Por favor adicione uma foto ou ficheiro da receita": ["Please add a photo or file of the prescription", "Añada una foto o archivo de la receta", "Bitte ein Foto oder eine Datei des Rezepts hinzufügen", "Veuillez ajouter une photo ou un fichier de l'ordonnance", "Por favor adicione uma foto ou arquivo da receita"],
  "Por favor adicione uma foto ou ficheiro do documento.": ["Please add a photo or file of the document.", "Añada una foto o archivo del documento.", "Bitte ein Foto oder eine Datei des Dokuments hinzufügen.", "Veuillez ajouter une photo ou un fichier du document.", "Por favor adicione uma foto ou arquivo do documento."],

  // ── Erros ─────────────────────────────────────────────────────────────
  "Erro": ["Error", "Error", "Fehler", "Erreur", "Erro"],
  "Erro ao carregar foto": ["Error uploading photo", "Error al subir la foto", "Fehler beim Hochladen des Fotos", "Erreur lors de l'envoi de la photo", "Erro ao carregar foto"],
  "Erro ao carregar foto 😿": ["Error uploading photo 😿", "Error al subir la foto 😿", "Fehler beim Hochladen des Fotos 😿", "Erreur lors de l'envoi de la photo 😿", "Erro ao carregar foto 😿"],
  "Erro ao entrar": ["Sign-in error", "Error al entrar", "Anmeldefehler", "Erreur de connexion", "Erro ao entrar"],
  "Erro ao escolher foto": ["Error choosing photo", "Error al elegir la foto", "Fehler beim Auswählen des Fotos", "Erreur lors du choix de la photo", "Erro ao escolher foto"],
  "Erro ao partilhar": ["Error sharing", "Error al compartir", "Fehler beim Teilen", "Erreur de partage", "Erro ao compartilhar"],
  "Erro no upload": ["Upload error", "Error de subida", "Upload-Fehler", "Erreur de téléversement", "Erro no envio"],
  "Atenção": ["Attention", "Atención", "Achtung", "Attention", "Atenção"],
  "Sem ligação": ["No connection", "Sin conexión", "Keine Verbindung", "Pas de connexion", "Sem conexão"],
  "Sem ligação ao servidor. Verifica o teu WiFi.": ["No connection to the server. Check your WiFi.", "Sin conexión al servidor. Comprueba tu WiFi.", "Keine Verbindung zum Server. Prüfe dein WLAN.", "Pas de connexion au serveur. Vérifiez votre WiFi.", "Sem conexão ao servidor. Verifique seu WiFi."],
  "Não foi possível abrir a câmara.": ["Could not open the camera.", "No se pudo abrir la cámara.", "Kamera konnte nicht geöffnet werden.", "Impossible d'ouvrir l'appareil photo.", "Não foi possível abrir a câmera."],
  "Não foi possível abrir a galeria.": ["Could not open the gallery.", "No se pudo abrir la galería.", "Galerie konnte nicht geöffnet werden.", "Impossible d'ouvrir la galerie.", "Não foi possível abrir a galeria."],
  "Não foi possível abrir a política de privacidade.": ["Could not open the privacy policy.", "No se pudo abrir la política de privacidad.", "Datenschutzerklärung konnte nicht geöffnet werden.", "Impossible d'ouvrir la politique de confidentialité.", "Não foi possível abrir a política de privacidade."],
  "Não foi possível abrir a videochamada.": ["Could not open the video call.", "No se pudo abrir la videollamada.", "Videoanruf konnte nicht geöffnet werden.", "Impossible d'ouvrir l'appel vidéo.", "Não foi possível abrir a videochamada."],
  "Não foi possível abrir o Google Maps": ["Could not open Google Maps", "No se pudo abrir Google Maps", "Google Maps konnte nicht geöffnet werden", "Impossible d'ouvrir Google Maps", "Não foi possível abrir o Google Maps"],
  "Não foi possível abrir o browser.": ["Could not open the browser.", "No se pudo abrir el navegador.", "Browser konnte nicht geöffnet werden.", "Impossible d'ouvrir le navigateur.", "Não foi possível abrir o navegador."],
  "Não foi possível abrir o email.": ["Could not open email.", "No se pudo abrir el correo.", "E-Mail konnte nicht geöffnet werden.", "Impossible d'ouvrir l'e-mail.", "Não foi possível abrir o e-mail."],
  "Não foi possível agendar. Tente novamente.": ["Could not schedule. Please try again.", "No se pudo agendar. Inténtelo de nuevo.", "Terminbuchung fehlgeschlagen. Bitte erneut versuchen.", "Impossible de planifier. Réessayez.", "Não foi possível agendar. Tente novamente."],
  "Não foi possível apagar. Tente outra vez.": ["Could not delete. Please try again.", "No se pudo eliminar. Inténtelo de nuevo.", "Löschen fehlgeschlagen. Bitte erneut versuchen.", "Impossible de supprimer. Réessayez.", "Não foi possível apagar. Tente outra vez."],
  "Não foi possível arquivar. Tente outra vez.": ["Could not archive. Please try again.", "No se pudo archivar. Inténtelo de nuevo.", "Archivieren fehlgeschlagen. Bitte erneut versuchen.", "Impossible d'archiver. Réessayez.", "Não foi possível arquivar. Tente outra vez."],
  "Não foi possível eliminar a consulta.": ["Could not delete the appointment.", "No se pudo eliminar la consulta.", "Termin konnte nicht gelöscht werden.", "Impossible de supprimer le rendez-vous.", "Não foi possível excluir a consulta."],
  "Não foi possível enviar a mensagem": ["Could not send the message", "No se pudo enviar el mensaje", "Nachricht konnte nicht gesendet werden", "Impossible d'envoyer le message", "Não foi possível enviar a mensagem"],
  "Não foi possível fazer upload da foto.": ["Could not upload the photo.", "No se pudo subir la foto.", "Foto konnte nicht hochgeladen werden.", "Impossible d'envoyer la photo.", "Não foi possível enviar a foto."],
  "Não foi possível guardar": ["Could not save", "No se pudo guardar", "Speichern fehlgeschlagen", "Impossible d'enregistrer", "Não foi possível salvar"],
  "Não foi possível guardar as alterações.": ["Could not save the changes.", "No se pudieron guardar los cambios.", "Änderungen konnten nicht gespeichert werden.", "Impossible d'enregistrer les modifications.", "Não foi possível salvar as alterações."],
  "Não foi possível guardar o perfil.": ["Could not save the profile.", "No se pudo guardar el perfil.", "Profil konnte nicht gespeichert werden.", "Impossible d'enregistrer le profil.", "Não foi possível salvar o perfil."],
  "Não foi possível guardar. Tente outra vez com internet.": ["Could not save. Try again with an internet connection.", "No se pudo guardar. Inténtelo de nuevo con internet.", "Speichern fehlgeschlagen. Mit Internetverbindung erneut versuchen.", "Impossible d'enregistrer. Réessayez avec une connexion internet.", "Não foi possível salvar. Tente outra vez com internet."],
  "Animal não encontrado": ["Pet not found", "Mascota no encontrada", "Tier nicht gefunden", "Animal introuvable", "Animal não encontrado"],
  "Consulta não encontrada.": ["Appointment not found.", "Consulta no encontrada.", "Termin nicht gefunden.", "Rendez-vous introuvable.", "Consulta não encontrada."],
  "Código inválido": ["Invalid code", "Código no válido", "Ungültiger Code", "Code invalide", "Código inválido"],
  "Link de videochamada não disponível.": ["Video call link not available.", "Enlace de videollamada no disponible.", "Videoanruf-Link nicht verfügbar.", "Lien d'appel vidéo indisponible.", "Link de videochamada não disponível."],

  // ── Permissões ────────────────────────────────────────────────────────
  "Permissão necessária": ["Permission required", "Permiso necesario", "Berechtigung erforderlich", "Autorisation requise", "Permissão necessária"],
  "Ative o acesso à câmara nas definições.": ["Enable camera access in settings.", "Active el acceso a la cámara en los ajustes.", "Kamerazugriff in den Einstellungen aktivieren.", "Activez l'accès à l'appareil photo dans les réglages.", "Ative o acesso à câmera nas configurações."],
  "Ative o acesso à câmara.": ["Enable camera access.", "Active el acceso a la cámara.", "Kamerazugriff aktivieren.", "Activez l'accès à l'appareil photo.", "Ative o acesso à câmera."],
  "Ative o acesso à galeria.": ["Enable gallery access.", "Active el acceso a la galería.", "Galeriezugriff aktivieren.", "Activez l'accès à la galerie.", "Ative o acesso à galeria."],
  "Precisamos de acesso à câmara.": ["We need camera access.", "Necesitamos acceso a la cámara.", "Wir benötigen Kamerazugriff.", "Nous avons besoin de l'accès à l'appareil photo.", "Precisamos de acesso à câmera."],
  "Precisamos de acesso à galeria.": ["We need gallery access.", "Necesitamos acceso a la galería.", "Wir benötigen Galeriezugriff.", "Nous avons besoin de l'accès à la galerie.", "Precisamos de acesso à galeria."],
  "Permissões do browser": ["Browser permissions", "Permisos del navegador", "Browser-Berechtigungen", "Autorisations du navigateur", "Permissões do navegador"],

  // ── Fotos ─────────────────────────────────────────────────────────────
  "Adicionar foto": ["Add photo", "Añadir foto", "Foto hinzufügen", "Ajouter une photo", "Adicionar foto"],
  "Adicionar fotos ao álbum 📸": ["Add photos to the album 📸", "Añadir fotos al álbum 📸", "Fotos zum Album hinzufügen 📸", "Ajouter des photos à l'album 📸", "Adicionar fotos ao álbum 📸"],
  "Alterar foto 📸": ["Change photo 📸", "Cambiar foto 📸", "Foto ändern 📸", "Changer la photo 📸", "Alterar foto 📸"],
  "Nova foto": ["New photo", "Nueva foto", "Neues Foto", "Nouvelle photo", "Nova foto"],
  "Foto de perfil": ["Profile photo", "Foto de perfil", "Profilfoto", "Photo de profil", "Foto de perfil"],
  "Remover foto": ["Remove photo", "Quitar foto", "Foto entfernen", "Supprimer la photo", "Remover foto"],
  "Eliminar foto?": ["Delete photo?", "¿Eliminar foto?", "Foto löschen?", "Supprimer la photo ?", "Excluir foto?"],
  "Toque para alterar a foto": ["Tap to change the photo", "Toca para cambiar la foto", "Zum Ändern des Fotos tippen", "Touchez pour changer la photo", "Toque para alterar a foto"],
  "Tirar foto": ["Take photo", "Hacer foto", "Foto aufnehmen", "Prendre une photo", "Tirar foto"],
  "📷 Tirar foto": ["📷 Take photo", "📷 Hacer foto", "📷 Foto aufnehmen", "📷 Prendre une photo", "📷 Tirar foto"],
  "📸 Tirar foto agora": ["📸 Take a photo now", "📸 Hacer una foto ahora", "📸 Jetzt Foto aufnehmen", "📸 Prendre une photo maintenant", "📸 Tirar foto agora"],
  "Escolher da galeria": ["Choose from gallery", "Elegir de la galería", "Aus Galerie wählen", "Choisir dans la galerie", "Escolher da galeria"],
  "🖼️ Escolher da galeria": ["🖼️ Choose from gallery", "🖼️ Elegir de la galería", "🖼️ Aus Galerie wählen", "🖼️ Choisir dans la galerie", "🖼️ Escolher da galeria"],
  "Escolher da galeria / ficheiros": ["Choose from gallery / files", "Elegir de la galería / archivos", "Aus Galerie / Dateien wählen", "Choisir dans la galerie / les fichiers", "Escolher da galeria / arquivos"],
  "Escolher fotos da galeria": ["Choose photos from the gallery", "Elegir fotos de la galería", "Fotos aus der Galerie wählen", "Choisir des photos dans la galerie", "Escolher fotos da galeria"],
  "Cortar uma foto antes de guardar": ["Crop a photo before saving", "Recortar una foto antes de guardar", "Foto vor dem Speichern zuschneiden", "Recadrer une photo avant d'enregistrer", "Cortar uma foto antes de salvar"],
  "Câmara": ["Camera", "Cámara", "Kamera", "Appareil photo", "Câmera"],
  "Câmara direta": ["Direct camera", "Cámara directa", "Direkte Kamera", "Appareil photo direct", "Câmera direta"],
  "Escolhe uma opção:": ["Choose an option:", "Elige una opción:", "Wähle eine Option:", "Choisissez une option :", "Escolha uma opção:"],
  "Escolha a foto do": ["Choose the photo of", "Elige la foto de", "Wähle das Foto von", "Choisissez la photo de", "Escolha a foto do"],
  "Use a câmara para fotografar o documento": ["Use the camera to photograph the document", "Usa la cámara para fotografiar el documento", "Mit der Kamera das Dokument fotografieren", "Utilisez l'appareil photo pour photographier le document", "Use a câmera para fotografar o documento"],
  "Sem fotos ainda": ["No photos yet", "Todavía no hay fotos", "Noch keine Fotos", "Pas encore de photos", "Sem fotos ainda"],
  "Álbum": ["Album", "Álbum", "Album", "Album", "Álbum"],
  "Álbum de Fotos 📸": ["Photo Album 📸", "Álbum de fotos 📸", "Fotoalbum 📸", "Album photo 📸", "Álbum de Fotos 📸"],
  "Álbum vazio": ["Album is empty", "Álbum vacío", "Album ist leer", "Album vide", "Álbum vazio"],
  "As memórias dos teus animais": ["Your pets' memories", "Los recuerdos de tus mascotas", "Die Erinnerungen deiner Tiere", "Les souvenirs de vos animaux", "As memórias dos seus animais"],
  "Adiciona o teu primeiro animal para começar a criar memórias!": ["Add your first pet to start creating memories!", "¡Añade tu primera mascota para empezar a crear recuerdos!", "Füge dein erstes Tier hinzu und sammle Erinnerungen!", "Ajoutez votre premier animal pour commencer à créer des souvenirs !", "Adicione seu primeiro animal para começar a criar memórias!"],
  "Adicione fotos do seu animal para criar memórias especiais.": ["Add photos of your pet to create special memories.", "Añada fotos de su mascota para crear recuerdos especiales.", "Fügen Sie Fotos Ihres Tieres hinzu und schaffen Sie besondere Erinnerungen.", "Ajoutez des photos de votre animal pour créer des souvenirs.", "Adicione fotos do seu animal para criar memórias especiais."],
  "Partilhe momentos dos seus animais": ["Share moments of your pets", "Comparta momentos de sus mascotas", "Teilen Sie Momente Ihrer Tiere", "Partagez des moments avec vos animaux", "Compartilhe momentos dos seus animais"],
  "Partilhe um momento com o seu animal... 🐾": ["Share a moment with your pet... 🐾", "Comparta un momento con su mascota... 🐾", "Teilen Sie einen Moment mit Ihrem Tier... 🐾", "Partagez un moment avec votre animal... 🐾", "Compartilhe um momento com seu animal... 🐾"],
  "Partilhe um momento especial do seu animal": ["Share a special moment with your pet", "Comparta un momento especial de su mascota", "Teilen Sie einen besonderen Moment Ihres Tieres", "Partagez un moment spécial de votre animal", "Compartilhe um momento especial do seu animal"],
  "Seja o primeiro a partilhar!": ["Be the first to share!", "¡Sé el primero en compartir!", "Sei der Erste, der teilt!", "Soyez le premier à partager !", "Seja o primeiro a compartilhar!"],

  // ── Saúde: consultas, vacinas, receitas, diário ───────────────────────
  ". Para urgências veterinárias, ligue para a clínica mais próxima ou dirija-se a uma clínica 24h.": [". For veterinary emergencies, call the nearest clinic or go to a 24h clinic.", ". Para urgencias veterinarias, llame a la clínica más cercana o acuda a una clínica 24h.", ". Bei tierärztlichen Notfällen rufen Sie die nächste Klinik an oder fahren Sie zu einer 24h-Klinik.", ". En cas d'urgence vétérinaire, appelez la clinique la plus proche ou rendez-vous dans une clinique 24h/24.", ". Para urgências veterinárias, ligue para a clínica mais próxima ou vá a uma clínica 24h."],
  "3 dias grátis • Sem cartão": ["3 days free • No card needed", "3 días gratis • Sin tarjeta", "3 Tage gratis • Ohne Karte", "3 jours gratuits • Sans carte", "3 dias grátis • Sem cartão"],
  "A cada quantos dias?": ["Every how many days?", "¿Cada cuántos días?", "Alle wie viele Tage?", "Tous les combien de jours ?", "A cada quantos dias?"],
  "A tua avaliação": ["Your rating", "Tu valoración", "Deine Bewertung", "Votre évaluation", "A sua avaliação"],
  "A vida do seu animal, organizada.": ["Your pet's life, organised.", "La vida de su mascota, organizada.", "Das Leben Ihres Tieres, gut organisiert.", "La vie de votre animal, organisée.", "A vida do seu animal, organizada."],
  "Acesso completo a todas as funcionalidades. Cancele quando quiser.": ["Full access to every feature. Cancel any time.", "Acceso completo a todas las funciones. Cancele cuando quiera.", "Voller Zugriff auf alle Funktionen. Jederzeit kündbar.", "Accès complet à toutes les fonctionnalités. Annulez quand vous voulez.", "Acesso completo a todas as funcionalidades. Cancele quando quiser."],
  "Acesso rápido": ["Quick access", "Acceso rápido", "Schnellzugriff", "Accès rapide", "Acesso rápido"],
  "Activar código": ["Activate code", "Activar código", "Code aktivieren", "Activer le code", "Ativar código"],
  "Adicionar": ["Add", "Añadir", "Hinzufügen", "Ajouter", "Adicionar"],
  "Adicionar Animal": ["Add Pet", "Añadir mascota", "Tier hinzufügen", "Ajouter un animal", "Adicionar animal"],
  "Adicionar animal": ["Add pet", "Añadir mascota", "Tier hinzufügen", "Ajouter un animal", "Adicionar animal"],
  "Adicionar outra hora": ["Add another time", "Añadir otra hora", "Weitere Uhrzeit hinzufügen", "Ajouter une autre heure", "Adicionar outro horário"],
  "Adicione o seu primeiro animal": ["Add your first pet", "Añada su primera mascota", "Fügen Sie Ihr erstes Tier hinzu", "Ajoutez votre premier animal", "Adicione o seu primeiro animal"],
  "Adicione um animal para gerir a sua saúde": ["Add a pet to manage its health", "Añada una mascota para gestionar su salud", "Fügen Sie ein Tier hinzu, um seine Gesundheit zu verwalten", "Ajoutez un animal pour gérer sa santé", "Adicione um animal para gerenciar a sua saúde"],
  "Adicione um animal primeiro.": ["Add a pet first.", "Añada primero una mascota.", "Fügen Sie zuerst ein Tier hinzu.", "Ajoutez d'abord un animal.", "Adicione um animal primeiro."],
  "Adoção": ["Adoption", "Adopción", "Adoption", "Adoption", "Adoção"],
  "Agende a sua primeira consulta online com um veterinário.": ["Book your first online appointment with a vet.", "Reserve su primera consulta online con un veterinario.", "Buchen Sie Ihren ersten Online-Termin mit einer Tierärztin oder einem Tierarzt.", "Réservez votre première consultation en ligne avec un vétérinaire.", "Agende a sua primeira consulta online com um veterinário."],
  "Agende ou registe uma consulta": ["Book or record an appointment", "Reserve o registre una consulta", "Termin buchen oder eintragen", "Réservez ou enregistrez un rendez-vous", "Agende ou registre uma consulta"],
  "Agende, receba o link, partilhe com o vet e entre directamente aqui. Sem instalações.": ["Book it, get the link, share it with the vet and join right here. No installs.", "Reserve, reciba el enlace, compártalo con el veterinario y entre aquí mismo. Sin instalaciones.", "Termin buchen, Link erhalten, mit dem Tierarzt teilen und direkt hier beitreten. Ohne Installation.", "Réservez, recevez le lien, partagez-le avec le vétérinaire et rejoignez ici. Sans installation.", "Agende, receba o link, compartilhe com o vet e entre direto aqui. Sem instalações."],
  "Ainda não há comentários. Seja a primeira pessoa a comentar 🐾": ["No comments yet. Be the first to comment 🐾", "Todavía no hay comentarios. Sea la primera persona en comentar 🐾", "Noch keine Kommentare. Schreiben Sie den ersten 🐾", "Pas encore de commentaires. Soyez le premier à commenter 🐾", "Ainda não há comentários. Seja a primeira pessoa a comentar 🐾"],
  "Ainda não há hotéis registados nesta área.": ["No hotels registered in this area yet.", "Todavía no hay hoteles registrados en esta zona.", "In diesem Gebiet sind noch keine Hotels eingetragen.", "Aucun hôtel enregistré dans cette zone pour le moment.", "Ainda não há hotéis cadastrados nesta área."],
  "Ainda não há missões": ["No missions yet", "Todavía no hay misiones", "Noch keine Missionen", "Pas encore de missions", "Ainda não há missões"],
  "Ainda não há serviços publicados nesta categoria.": ["No services posted in this category yet.", "Todavía no hay servicios publicados en esta categoría.", "In dieser Kategorie wurden noch keine Dienste eingestellt.", "Aucun service publié dans cette catégorie pour le moment.", "Ainda não há serviços publicados nesta categoria."],
  "Ainda não há tosquiadores registados nesta área.": ["No groomers registered in this area yet.", "Todavía no hay peluqueros caninos registrados en esta zona.", "In diesem Gebiet sind noch keine Hundefriseure eingetragen.", "Aucun toiletteur enregistré dans cette zone pour le moment.", "Ainda não há tosadores cadastrados nesta área."],
  "Ainda não há treinadores registados nesta área.": ["No trainers registered in this area yet.", "Todavía no hay adiestradores registrados en esta zona.", "In diesem Gebiet sind noch keine Trainer eingetragen.", "Aucun éducateur enregistré dans cette zone pour le moment.", "Ainda não há adestradores cadastrados nesta área."],
  "Ainda não tens conversas": ["You have no conversations yet", "Todavía no tienes conversaciones", "Du hast noch keine Unterhaltungen", "Vous n'avez pas encore de conversations", "Ainda não tem conversas"],
  "Ainda sem avaliações. Sê o primeiro!": ["No reviews yet. Be the first!", "Todavía sin valoraciones. ¡Sé el primero!", "Noch keine Bewertungen. Sei der Erste!", "Pas encore d'avis. Soyez le premier !", "Ainda sem avaliações. Seja o primeiro!"],
  "Ajuda a encontrar animais perdidos": ["Help find lost pets", "Ayuda a encontrar mascotas perdidas", "Hilf, vermisste Tiere zu finden", "Aidez à retrouver les animaux perdus", "Ajude a encontrar animais perdidos"],
  "Alergias, condições especiais...": ["Allergies, special conditions...", "Alergias, condiciones especiales...", "Allergien, besondere Umstände...", "Allergies, conditions particulières...", "Alergias, condições especiais..."],
  "Animais à espera de um lar amoroso": ["Pets waiting for a loving home", "Mascotas esperando un hogar lleno de cariño", "Tiere, die auf ein liebevolles Zuhause warten", "Des animaux qui attendent un foyer aimant", "Animais à espera de um lar amoroso"],
  "Animal *": ["Pet *", "Mascota *", "Tier *", "Animal *", "Animal *"],
  "Animal Perdido": ["Lost Pet", "Mascota perdida", "Vermisstes Tier", "Animal perdu", "Animal perdido"],
  "Anúncio guardado. Será sincronizado em breve.": ["Listing saved. It will sync shortly.", "Anuncio guardado. Se sincronizará en breve.", "Anzeige gespeichert. Sie wird in Kürze synchronisiert.", "Annonce enregistrée. Elle sera synchronisée sous peu.", "Anúncio salvo. Será sincronizado em breve."],
  "Anúncios": ["Listings", "Anuncios", "Anzeigen", "Annonces", "Anúncios"],
  "Apagar": ["Delete", "Eliminar", "Löschen", "Supprimer", "Apagar"],
  "Apagar comentário": ["Delete comment", "Eliminar comentario", "Kommentar löschen", "Supprimer le commentaire", "Apagar comentário"],
  "Apagar conteúdo": ["Delete content", "Eliminar contenido", "Inhalt löschen", "Supprimer le contenu", "Apagar conteúdo"],
  "Apagar código": ["Delete code", "Eliminar código", "Code löschen", "Supprimer le code", "Apagar código"],
  "Apagar lembrete": ["Delete reminder", "Eliminar recordatorio", "Erinnerung löschen", "Supprimer le rappel", "Apagar lembrete"],
  "Apagar missão": ["Delete mission", "Eliminar misión", "Mission löschen", "Supprimer la mission", "Apagar missão"],
  "Apagar parceiro": ["Delete partner", "Eliminar socio", "Partner löschen", "Supprimer le partenaire", "Apagar parceiro"],
  "As notificações são geradas a partir dos dados de saúde dos teus animais 🐾": ["Notifications come from your pets' health data 🐾", "Las notificaciones se generan a partir de los datos de salud de tus mascotas 🐾", "Die Benachrichtigungen stammen aus den Gesundheitsdaten deiner Tiere 🐾", "Les notifications proviennent des données de santé de vos animaux 🐾", "As notificações são geradas a partir dos dados de saúde dos seus animais 🐾"],
  "As tuas conversas com outros donos": ["Your chats with other owners", "Tus conversaciones con otros dueños", "Deine Gespräche mit anderen Haltern", "Vos conversations avec d'autres propriétaires", "As suas conversas com outros donos"],
  "Caderneta / Comprovativo (foto ou PDF)": ["Record book / proof (photo or PDF)", "Cartilla / comprobante (foto o PDF)", "Impfpass / Nachweis (Foto oder PDF)", "Carnet / justificatif (photo ou PDF)", "Carteirinha / comprovante (foto ou PDF)"],
  "Carregue sempre em \"Permitir\" para a chamada funcionar correctamente.": ["Always tap \"Allow\" so the call works properly.", "Pulse siempre en \"Permitir\" para que la llamada funcione bien.", "Tippen Sie immer auf \"Erlauben\", damit der Anruf funktioniert.", "Appuyez toujours sur « Autoriser » pour que l'appel fonctionne.", "Toque sempre em \"Permitir\" para a chamada funcionar corretamente."],
  "Clica no + para adicionar o primeiro peso": ["Tap + to add the first weight", "Pulsa + para añadir el primer peso", "Tippe auf +, um das erste Gewicht einzutragen", "Appuyez sur + pour ajouter le premier poids", "Toque no + para adicionar o primeiro peso"],
  "Clínica": ["Clinic", "Clínica", "Klinik", "Clinique", "Clínica"],
  "Clínica / Hospital": ["Clinic / Hospital", "Clínica / Hospital", "Klinik / Tierklinik", "Clinique / Hôpital", "Clínica / Hospital"],
  "Clínicas Veterinárias": ["Veterinary Clinics", "Clínicas veterinarias", "Tierarztpraxen", "Cliniques vétérinaires", "Clínicas veterinárias"],
  "Clínicas, lojas e serviços perto de si": ["Clinics, shops and services near you", "Clínicas, tiendas y servicios cerca de usted", "Kliniken, Läden und Dienste in Ihrer Nähe", "Cliniques, boutiques et services près de chez vous", "Clínicas, lojas e serviços perto de você"],
  "Começar 3 dias grátis": ["Start 3 days free", "Empezar 3 días gratis", "3 Tage gratis starten", "Commencer 3 jours gratuits", "Começar 3 dias grátis"],
  "Começar grátis": ["Start free", "Empezar gratis", "Gratis starten", "Commencer gratuitement", "Começar grátis"],
  "Como consultar o vet online": ["How to see the vet online", "Cómo consultar al veterinario online", "So sprechen Sie online mit dem Tierarzt", "Comment consulter le vétérinaire en ligne", "Como consultar o vet online"],
  "Comprar online em lojas certificadas:": ["Buy online from certified shops:", "Comprar online en tiendas certificadas:", "Online bei zertifizierten Shops kaufen:", "Acheter en ligne dans des boutiques certifiées :", "Comprar online em lojas certificadas:"],
  "Comprovativo / Foto": ["Proof / Photo", "Comprobante / Foto", "Nachweis / Foto", "Justificatif / Photo", "Comprovante / Foto"],
  "Confirme aqui e os avisos do QR code desse animal deixam de aparecer.": ["Confirm here and the QR code alerts for that pet will stop appearing.", "Confirme aquí y las alertas del código QR de esa mascota dejarán de aparecer.", "Bestätigen Sie hier und die QR-Code-Hinweise für dieses Tier verschwinden.", "Confirmez ici et les alertes du QR code de cet animal cesseront d'apparaître.", "Confirme aqui e os avisos do QR code desse animal deixam de aparecer."],
  "Consulta actualizada com sucesso.": ["Appointment updated successfully.", "Consulta actualizada con éxito.", "Termin erfolgreich aktualisiert.", "Rendez-vous mis à jour avec succès.", "Consulta atualizada com sucesso."],
  "Consulta adicionada com sucesso.": ["Appointment added successfully.", "Consulta añadida con éxito.", "Termin erfolgreich hinzugefügt.", "Rendez-vous ajouté avec succès.", "Consulta adicionada com sucesso."],
  "Consulta online com o seu vet": ["Online appointment with your vet", "Consulta online con su veterinario", "Online-Sprechstunde mit Ihrem Tierarzt", "Consultation en ligne avec votre vétérinaire", "Consulta online com o seu vet"],
  "Consultas em dia, bichinho a sorrir! 😸🐾": ["Check-ups up to date, happy pet! 😸🐾", "¡Consultas al día, mascota feliz! 😸🐾", "Termine erledigt, glückliches Tier! 😸🐾", "Rendez-vous à jour, animal heureux ! 😸🐾", "Consultas em dia, bichinho sorrindo! 😸🐾"],
  "Conta tudo sobre o teu bichinho... 🐾": ["Tell us all about your pet... 🐾", "Cuéntanos todo sobre tu mascota... 🐾", "Erzähl uns alles über dein Tier... 🐾", "Racontez tout sur votre animal... 🐾", "Conte tudo sobre o seu bichinho... 🐾"],
  "Conte a história desta missão...": ["Tell the story of this mission...", "Cuente la historia de esta misión...", "Erzählen Sie die Geschichte dieser Mission...", "Racontez l'histoire de cette mission...", "Conte a história desta missão..."],
  "Conteúdo que os utilizadores assinalaram": ["Content flagged by users", "Contenido señalado por los usuarios", "Von Nutzern gemeldete Inhalte", "Contenus signalés par les utilisateurs", "Conteúdo sinalizado pelos usuários"],
  "Cria lembretes para não te esqueceres de dar a medicação ou fazer um tratamento.": ["Create reminders so you don't forget medication or treatments.", "Crea recordatorios para no olvidar la medicación o un tratamiento.", "Erstelle Erinnerungen, damit du Medikamente oder Behandlungen nicht vergisst.", "Créez des rappels pour ne pas oublier les médicaments ou les traitements.", "Crie lembretes para não esquecer de dar a medicação ou fazer um tratamento."],
  "Criar conta": ["Create account", "Crear cuenta", "Konto erstellen", "Créer un compte", "Criar conta"],
  "Criar código": ["Create code", "Crear código", "Code erstellen", "Créer un code", "Criar código"],
  "Crie o perfil do seu pet e comece a organizar a sua saúde.": ["Create your pet's profile and start organising its health.", "Cree el perfil de su mascota y empiece a organizar su salud.", "Legen Sie das Profil Ihres Tieres an und organisieren Sie seine Gesundheit.", "Créez le profil de votre animal et organisez sa santé.", "Crie o perfil do seu pet e comece a organizar a saúde dele."],
  "Cuide da saúde do seu animal": ["Take care of your pet's health", "Cuide la salud de su mascota", "Kümmern Sie sich um die Gesundheit Ihres Tieres", "Prenez soin de la santé de votre animal", "Cuide da saúde do seu animal"],
  "Cuide do seu animal": ["Take care of your pet", "Cuide de su mascota", "Kümmern Sie sich um Ihr Tier", "Prenez soin de votre animal", "Cuide do seu animal"],
  "Código (opcional)": ["Code (optional)", "Código (opcional)", "Code (optional)", "Code (facultatif)", "Código (opcional)"],
  "Código criado": ["Code created", "Código creado", "Code erstellt", "Code créé", "Código criado"],
  "Código de Parceiro": ["Partner Code", "Código de socio", "Partner-Code", "Code partenaire", "Código de parceiro"],
  "Código de identificação": ["Identification code", "Código de identificación", "Kennnummer", "Code d'identification", "Código de identificação"],
  "Código dele (opcional)": ["Their code (optional)", "Su código (opcional)", "Sein Code (optional)", "Son code (facultatif)", "O código dele (opcional)"],
  "Data da consulta": ["Appointment date", "Fecha de la consulta", "Termindatum", "Date du rendez-vous", "Data da consulta"],
  "Data de administração": ["Date given", "Fecha de administración", "Datum der Verabreichung", "Date d'administration", "Data de administração"],
  "Data de aplicação": ["Date applied", "Fecha de aplicación", "Datum der Anwendung", "Date d'application", "Data de aplicação"],
  "Data de fim (opcional)": ["End date (optional)", "Fecha de fin (opcional)", "Enddatum (optional)", "Date de fin (facultative)", "Data de fim (opcional)"],
  "Data de início": ["Start date", "Fecha de inicio", "Startdatum", "Date de début", "Data de início"],
  "Data de nascimento": ["Date of birth", "Fecha de nacimiento", "Geburtsdatum", "Date de naissance", "Data de nascimento"],
  "Denúncias": ["Reports", "Denuncias", "Meldungen", "Signalements", "Denúncias"],
  "Descreva em detalhe o que observou...": ["Describe in detail what you saw...", "Describa en detalle lo que observó...", "Beschreiben Sie ausführlich, was Sie beobachtet haben...", "Décrivez en détail ce que vous avez observé...", "Descreva em detalhe o que observou..."],
  "Descreva o animal, produto ou serviço com detalhe...": ["Describe the pet, product or service in detail...", "Describa la mascota, el producto o el servicio en detalle...", "Beschreiben Sie das Tier, Produkt oder die Leistung im Detail...", "Décrivez l'animal, le produit ou le service en détail...", "Descreva o animal, produto ou serviço com detalhe..."],
  "Descreva o motivo da consulta...": ["Describe the reason for the appointment...", "Describa el motivo de la consulta...", "Beschreiben Sie den Grund des Termins...", "Décrivez le motif du rendez-vous...", "Descreva o motivo da consulta..."],
  "Descreva o motivo...": ["Describe the reason...", "Describa el motivo...", "Beschreiben Sie den Grund...", "Décrivez le motif...", "Descreva o motivo..."],
  "Descreve o que observaste...": ["Describe what you saw...", "Describe lo que observaste...", "Beschreibe, was du beobachtet hast...", "Décrivez ce que vous avez observé...", "Descreva o que observou..."],
  "Descreve os serviços e especialidades...": ["Describe the services and specialities...", "Describe los servicios y especialidades...", "Beschreibe die Leistungen und Spezialgebiete...", "Décrivez les services et les spécialités...", "Descreva os serviços e especialidades..."],
  "Descrição": ["Description", "Descripción", "Beschreibung", "Description", "Descrição"],
  "Descrição *": ["Description *", "Descripción *", "Beschreibung *", "Description *", "Descrição *"],
  "Desparasitação": ["Deworming", "Desparasitación", "Entwurmung", "Vermifugation", "Vermifugação"],
  "Diário de Saúde": ["Health Diary", "Diario de salud", "Gesundheitstagebuch", "Journal de santé", "Diário de saúde"],
  "Diário de Saúde ❤️": ["Health Diary ❤️", "Diario de salud ❤️", "Gesundheitstagebuch ❤️", "Journal de santé ❤️", "Diário de saúde ❤️"],
  "Diário vazio": ["Diary is empty", "Diario vacío", "Tagebuch ist leer", "Journal vide", "Diário vazio"],
  "Documento adicionado com sucesso.": ["Document added successfully.", "Documento añadido con éxito.", "Dokument erfolgreich hinzugefügt.", "Document ajouté avec succès.", "Documento adicionado com sucesso."],
  "Dosagem, instruções...": ["Dosage, instructions...", "Dosis, instrucciones...", "Dosierung, Hinweise...", "Dosage, instructions...", "Dosagem, instruções..."],
  "Dose de": ["Dose of", "Dosis de", "Dosis von", "Dose de", "Dose de"],
  "Duração": ["Duration", "Duración", "Dauer", "Durée", "Duração"],

  // ── Formulários, campos e exemplos ────────────────────────────────────
  "Eliminar animal": ["Delete pet", "Eliminar mascota", "Tier löschen", "Supprimer l'animal", "Excluir animal"],
  "Em Portugal, o número de emergência é o": ["In Portugal, the emergency number is", "En Portugal, el número de emergencia es el", "In Portugal lautet die Notrufnummer", "Au Portugal, le numéro d'urgence est le", "Em Portugal, o número de emergência é o"],
  "Em breve": ["Coming soon", "Próximamente", "Demnächst", "Bientôt disponible", "Em breve"],
  "Em caso de emergência grave, contacte sempre um veterinário. Este guia é de apoio, baseado em fontes veterinárias reconhecidas — não substitui cuidados médicos.": ["In a serious emergency always contact a vet. This guide is support material based on recognised veterinary sources — it does not replace medical care.", "En caso de emergencia grave, contacte siempre con un veterinario. Esta guía es de apoyo, basada en fuentes veterinarias reconocidas: no sustituye la atención médica.", "Bei einem ernsten Notfall wenden Sie sich immer an eine Tierärztin oder einen Tierarzt. Dieser Leitfaden dient der Unterstützung und beruht auf anerkannten veterinärmedizinischen Quellen — er ersetzt keine medizinische Versorgung.", "En cas d'urgence grave, contactez toujours un vétérinaire. Ce guide est un support fondé sur des sources vétérinaires reconnues — il ne remplace pas des soins médicaux.", "Em caso de emergência grave, contate sempre um veterinário. Este guia é de apoio, baseado em fontes veterinárias reconhecidas — não substitui cuidados médicos."],
  "Email do vet (para partilhar o link)": ["Vet's email (to share the link)", "Email del veterinario (para compartir el enlace)", "E-Mail des Tierarztes (um den Link zu teilen)", "E-mail du vétérinaire (pour partager le lien)", "E-mail do vet (para compartilhar o link)"],
  "Entrada no Diário": ["Diary Entry", "Entrada del diario", "Tagebucheintrag", "Entrée du journal", "Entrada no diário"],
  "Entrada no diário adicionada.": ["Diary entry added.", "Entrada del diario añadida.", "Tagebucheintrag hinzugefügt.", "Entrée ajoutée au journal.", "Entrada no diário adicionada."],
  "Envia a primeira mensagem!": ["Send the first message!", "¡Envía el primer mensaje!", "Schick die erste Nachricht!", "Envoyez le premier message !", "Envie a primeira mensagem!"],
  "Enviamos um link para o teu email.": ["We've sent a link to your email.", "Te hemos enviado un enlace por email.", "Wir haben dir einen Link per E-Mail geschickt.", "Nous vous avons envoyé un lien par e-mail.", "Enviamos um link para o seu e-mail."],
  "Enviar Avaliação": ["Send Review", "Enviar valoración", "Bewertung senden", "Envoyer l'avis", "Enviar avaliação"],
  "Escreva um comentário...": ["Write a comment...", "Escriba un comentario...", "Kommentar schreiben...", "Écrivez un commentaire...", "Escreva um comentário..."],
  "Escreve um comentário...": ["Write a comment...", "Escribe un comentario...", "Kommentar schreiben...", "Écrivez un commentaire...", "Escreva um comentário..."],
  "Escreve uma mensagem...": ["Write a message...", "Escribe un mensaje...", "Nachricht schreiben...", "Écrivez un message...", "Escreva uma mensagem..."],
  "Espécie": ["Species", "Especie", "Tierart", "Espèce", "Espécie"],
  "Espécie *": ["Species *", "Especie *", "Tierart *", "Espèce *", "Espécie *"],
  "Esqueceu a senha?": ["Forgot your password?", "¿Olvidó la contraseña?", "Passwort vergessen?", "Mot de passe oublié ?", "Esqueceu a senha?"],
  "Esta ação não pode ser desfeita.": ["This action cannot be undone.", "Esta acción no se puede deshacer.", "Diese Aktion kann nicht rückgängig gemacht werden.", "Cette action est irréversible.", "Esta ação não pode ser desfeita."],
  "Este animal ainda não tem QR Code gerado. Tente novamente em breve.": ["This pet has no QR code yet. Please try again shortly.", "Esta mascota aún no tiene código QR. Inténtelo de nuevo en breve.", "Für dieses Tier wurde noch kein QR-Code erstellt. Bitte versuchen Sie es gleich erneut.", "Cet animal n'a pas encore de QR code. Réessayez dans un instant.", "Este animal ainda não tem QR Code gerado. Tente novamente em breve."],
  "Este painel é só para a administração da PetsLife.": ["This panel is for PetsLife administration only.", "Este panel es solo para la administración de PetsLife.", "Dieses Panel ist nur für die PetsLife-Administration.", "Ce panneau est réservé à l'administration PetsLife.", "Este painel é só para a administração da PetsLife."],
  "Está tudo bem": ["Everything is fine", "Todo está bien", "Alles in Ordnung", "Tout va bien", "Está tudo bem"],
  "Está tudo tranquilo. Quando alguém denunciar conteúdo, aparece aqui.": ["All quiet. When someone reports content, it shows up here.", "Todo tranquilo. Cuando alguien denuncie contenido, aparecerá aquí.", "Alles ruhig. Wenn jemand Inhalte meldet, erscheinen sie hier.", "Tout est calme. Quand quelqu'un signale un contenu, il apparaît ici.", "Está tudo tranquilo. Quando alguém denunciar conteúdo, aparece aqui."],
  "Evolução do Peso": ["Weight Progress", "Evolución del peso", "Gewichtsverlauf", "Évolution du poids", "Evolução do peso"],
  "Ex: 1 comprimido de manhã e à noite...": ["e.g. 1 tablet morning and night...", "Ej.: 1 comprimido por la mañana y por la noche...", "z. B. 1 Tablette morgens und abends...", "Ex. : 1 comprimé matin et soir...", "Ex: 1 comprimido de manhã e à noite..."],
  "Ex: Antibiótico, Anti-inflamatório...": ["e.g. Antibiotic, Anti-inflammatory...", "Ej.: Antibiótico, antiinflamatorio...", "z. B. Antibiotikum, Entzündungshemmer...", "Ex. : Antibiotique, anti-inflammatoire...", "Ex: Antibiótico, Anti-inflamatório..."],
  "Ex: Antibiótico, Vermífugo...": ["e.g. Antibiotic, Dewormer...", "Ej.: Antibiótico, antiparasitario...", "z. B. Antibiotikum, Wurmkur...", "Ex. : Antibiotique, vermifuge...", "Ex: Antibiótico, Vermífugo..."],
  "Ex: Cachorro Labrador para adopção": ["e.g. Labrador puppy for adoption", "Ej.: Cachorro labrador en adopción", "z. B. Labrador-Welpe zur Adoption", "Ex. : Chiot labrador à adopter", "Ex: Filhote de Labrador para adoção"],
  "Ex: Check-up anual, Vacinação anual...": ["e.g. Annual check-up, annual vaccination...", "Ej.: Revisión anual, vacunación anual...", "z. B. Jahresuntersuchung, jährliche Impfung...", "Ex. : Bilan annuel, vaccination annuelle...", "Ex: Check-up anual, Vacinação anual..."],
  "Ex: Check-up anual, Vacinação...": ["e.g. Annual check-up, vaccination...", "Ej.: Revisión anual, vacunación...", "z. B. Jahresuntersuchung, Impfung...", "Ex. : Bilan annuel, vaccination...", "Ex: Check-up anual, Vacinação..."],
  "Ex: Clínica Vet Lisboa": ["e.g. Lisbon Vet Clinic", "Ej.: Clínica Vet Lisboa", "z. B. Tierklinik Lissabon", "Ex. : Clinique Vét Lisbonne", "Ex: Clínica Vet São Paulo"],
  "Ex: Clínica Veterinária Central": ["e.g. Central Veterinary Clinic", "Ej.: Clínica Veterinaria Central", "z. B. Tierarztpraxis Zentrum", "Ex. : Clinique vétérinaire du Centre", "Ex: Clínica Veterinária Central"],
  "Ex: Consulta de rotina...": ["e.g. Routine appointment...", "Ej.: Consulta de rutina...", "z. B. Routineuntersuchung...", "Ex. : Consultation de routine...", "Ex: Consulta de rotina..."],
  "Ex: Dr. António Silva": ["e.g. Dr. Anthony Smith", "Ej.: Dr. Antonio Silva", "z. B. Dr. Anton Schmidt", "Ex. : Dr Antoine Silva", "Ex: Dr. Antônio Silva"],
  "Ex: Influencer João": ["e.g. Influencer John", "Ej.: Influencer Juan", "z. B. Influencer Jan", "Ex. : Influenceur Jean", "Ex: Influenciador João"],
  "Ex: JOAO — deixa vazio para gerar": ["e.g. JOHN — leave blank to generate", "Ej.: JUAN — déjalo vacío para generarlo", "z. B. JAN — leer lassen zum Erzeugen", "Ex. : JEAN — laissez vide pour générer", "Ex: JOAO — deixe vazio para gerar"],
  "Ex: JOAO10 — vazio para gerar": ["e.g. JOHN10 — blank to generate", "Ej.: JUAN10 — vacío para generarlo", "z. B. JAN10 — leer zum Erzeugen", "Ex. : JEAN10 — vide pour générer", "Ex: JOAO10 — vazio para gerar"],
  "Ex: Labrador, Siamês...": ["e.g. Labrador, Siamese...", "Ej.: Labrador, siamés...", "z. B. Labrador, Siam...", "Ex. : Labrador, siamois...", "Ex: Labrador, Siamês..."],
  "Ex: Lisboa, Porto, Setúbal...": ["e.g. London, Manchester, Leeds...", "Ej.: Madrid, Barcelona, Valencia...", "z. B. Berlin, Hamburg, München...", "Ex. : Paris, Lyon, Marseille...", "Ex: São Paulo, Rio de Janeiro, Belo Horizonte..."],
  "Ex: Passaporte Europeu, Licença Municipal...": ["e.g. European passport, municipal licence...", "Ej.: Pasaporte europeo, licencia municipal...", "z. B. EU-Heimtierausweis, städtische Lizenz...", "Ex. : Passeport européen, licence municipale...", "Ex: Passaporte, Registro municipal..."],
  "Ex: Raiva, Parvovírus, Esgana, Leucemia...": ["e.g. Rabies, Parvovirus, Distemper, Leukaemia...", "Ej.: Rabia, parvovirus, moquillo, leucemia...", "z. B. Tollwut, Parvovirose, Staupe, Leukose...", "Ex. : Rage, parvovirose, maladie de Carré, leucose...", "Ex: Raiva, Parvovirose, Cinomose, Leucemia..."],
  "Ex: Raiva, Parvovírus, Esgana...": ["e.g. Rabies, Parvovirus, Distemper...", "Ej.: Rabia, parvovirus, moquillo...", "z. B. Tollwut, Parvovirose, Staupe...", "Ex. : Rage, parvovirose, maladie de Carré...", "Ex: Raiva, Parvovirose, Cinomose..."],
  "Ex: Raiva, Parvovírus...": ["e.g. Rabies, Parvovirus...", "Ej.: Rabia, parvovirus...", "z. B. Tollwut, Parvovirose...", "Ex. : Rage, parvovirose...", "Ex: Raiva, Parvovirose..."],
  "Ex: Seg-Sex 9h-18h, Sáb 9h-13h": ["e.g. Mon-Fri 9am-6pm, Sat 9am-1pm", "Ej.: Lun-Vie 9h-18h, Sáb 9h-13h", "z. B. Mo-Fr 9-18 Uhr, Sa 9-13 Uhr", "Ex. : Lun-Ven 9h-18h, Sam 9h-13h", "Ex: Seg-Sex 9h-18h, Sáb 9h-13h"],
  "Ex: Vómito após refeição, Letargia...": ["e.g. Vomiting after meals, lethargy...", "Ej.: Vómito tras la comida, letargo...", "z. B. Erbrechen nach dem Fressen, Mattigkeit...", "Ex. : Vomissements après le repas, léthargie...", "Ex: Vômito após refeição, Letargia..."],
  "Ex: dar com comida": ["e.g. give with food", "Ej.: dar con comida", "z. B. mit Futter geben", "Ex. : à donner avec de la nourriture", "Ex: dar com comida"],
  "Ex: story de Agosto": ["e.g. August story", "Ej.: story de agosto", "z. B. Story im August", "Ex. : story d'août", "Ex: story de agosto"],
  "Fala com outros donos a partir da Comunidade, do Marketplace ou dos anúncios de animais perdidos.": ["Chat with other owners from the Community, the Marketplace or the lost pet listings.", "Habla con otros dueños desde la Comunidad, el Marketplace o los anuncios de mascotas perdidas.", "Sprich mit anderen Haltern über die Community, den Marktplatz oder die Vermisstenanzeigen.", "Discutez avec d'autres propriétaires depuis la Communauté, la Marketplace ou les annonces d'animaux perdus.", "Fale com outros donos a partir da Comunidade, do Marketplace ou dos anúncios de animais perdidos."],
  "Fale com o seu vet por videochamada": ["Talk to your vet by video call", "Hable con su veterinario por videollamada", "Sprechen Sie per Videoanruf mit Ihrem Tierarzt", "Parlez à votre vétérinaire en visioconférence", "Fale com o seu vet por videochamada"],
  "Farmácia Veterinária 💊": ["Vet Pharmacy 💊", "Farmacia veterinaria 💊", "Tierapotheke 💊", "Pharmacie vétérinaire 💊", "Farmácia veterinária 💊"],
  "Foto / Scan da receita": ["Photo / scan of the prescription", "Foto / escaneo de la receta", "Foto / Scan des Rezepts", "Photo / scan de l'ordonnance", "Foto / Scan da receita"],
  "Foto / Scan do documento": ["Photo / scan of the document", "Foto / escaneo del documento", "Foto / Scan des Dokuments", "Photo / scan du document", "Foto / Scan do documento"],
  "Frequência": ["Frequency", "Frecuencia", "Häufigkeit", "Fréquence", "Frequência"],
  "Gerencie a saúde dos seus animais": ["Manage your pets' health", "Gestione la salud de sus mascotas", "Verwalten Sie die Gesundheit Ihrer Tiere", "Gérez la santé de vos animaux", "Gerencie a saúde dos seus animais"],
  "Grooming e estética para o seu pet": ["Grooming and styling for your pet", "Peluquería y estética para su mascota", "Pflege und Styling für Ihr Tier", "Toilettage et esthétique pour votre animal", "Banho, tosa e estética para o seu pet"],
  "Guardar": ["Save", "Guardar", "Speichern", "Enregistrer", "Salvar"],
  "Guardar Animal": ["Save Pet", "Guardar mascota", "Tier speichern", "Enregistrer l'animal", "Salvar animal"],
  "Guardar Consulta": ["Save Appointment", "Guardar consulta", "Termin speichern", "Enregistrer le rendez-vous", "Salvar consulta"],
  "Guardar Desparasitação": ["Save Deworming", "Guardar desparasitación", "Entwurmung speichern", "Enregistrer la vermifugation", "Salvar vermifugação"],
  "Guardar Documento": ["Save Document", "Guardar documento", "Dokument speichern", "Enregistrer le document", "Salvar documento"],
  "Guardar Entrada": ["Save Entry", "Guardar entrada", "Eintrag speichern", "Enregistrer l'entrée", "Salvar entrada"],
  "Guardar Peso": ["Save Weight", "Guardar peso", "Gewicht speichern", "Enregistrer le poids", "Salvar peso"],
  "Guardar Receita": ["Save Prescription", "Guardar receta", "Rezept speichern", "Enregistrer l'ordonnance", "Salvar receita"],
  "Guardar Vacina": ["Save Vaccine", "Guardar vacuna", "Impfung speichern", "Enregistrer le vaccin", "Salvar vacina"],
  "Guardar alterações": ["Save changes", "Guardar cambios", "Änderungen speichern", "Enregistrer les modifications", "Salvar alterações"],
  "Guardar lembrete": ["Save reminder", "Guardar recordatorio", "Erinnerung speichern", "Enregistrer le rappel", "Salvar lembrete"],
  "Guarde o passaporte, seguros, exames e mais do seu animal! Tudo organizado 📂✨": ["Keep your pet's passport, insurance, test results and more! All organised 📂✨", "¡Guarde el pasaporte, seguros, análisis y más de su mascota! Todo organizado 📂✨", "Bewahren Sie Heimtierausweis, Versicherung, Befunde und mehr auf! Alles geordnet 📂✨", "Conservez le passeport, les assurances, les examens et plus encore ! Tout est organisé 📂✨", "Guarde o passaporte, seguros, exames e mais do seu animal! Tudo organizado 📂✨"],
  "Guarde todas as receitas do seu bichinho num só lugar! 💜🐾": ["Keep all your pet's prescriptions in one place! 💜🐾", "¡Guarde todas las recetas de su mascota en un solo lugar! 💜🐾", "Bewahren Sie alle Rezepte Ihres Tieres an einem Ort auf! 💜🐾", "Conservez toutes les ordonnances de votre animal au même endroit ! 💜🐾", "Guarde todas as receitas do seu bichinho num só lugar! 💜🐾"],
  "Guia de Raças 📖": ["Breed Guide 📖", "Guía de razas 📖", "Rasseführer 📖", "Guide des races 📖", "Guia de raças 📖"],
  "Guia de Videochamada": ["Video Call Guide", "Guía de videollamada", "Leitfaden für Videoanrufe", "Guide de la visioconférence", "Guia de videochamada"],
  "Guia de emergência para animais": ["Emergency guide for pets", "Guía de emergencia para mascotas", "Notfall-Leitfaden für Tiere", "Guide d'urgence pour animaux", "Guia de emergência para animais"],
  "Guias com vídeo incluído": ["Guides with video included", "Guías con vídeo incluido", "Anleitungen mit Video", "Guides avec vidéo incluse", "Guias com vídeo incluído"],
  "Histórico": ["History", "Historial", "Verlauf", "Historique", "Histórico"],
  "Horário": ["Opening hours", "Horario", "Öffnungszeiten", "Horaires", "Horário"],
  "Hospedagem confortável para o seu pet": ["Comfortable boarding for your pet", "Alojamiento cómodo para su mascota", "Komfortable Unterbringung für Ihr Tier", "Hébergement confortable pour votre animal", "Hospedagem confortável para o seu pet"],
  "Hotéis para Animais": ["Pet Hotels", "Hoteles para mascotas", "Tierhotels", "Hôtels pour animaux", "Hotéis para animais"],
  "Há só um link, e é este (a caixa verde). Partilhe-o com o veterinário — é por aqui que os dois entram na videochamada.": ["There's only one link, and it's this one (the green box). Share it with the vet — this is how you both join the video call.", "Solo hay un enlace, y es este (la caja verde). Compártalo con el veterinario: por aquí entran los dos a la videollamada.", "Es gibt nur einen Link, nämlich diesen (das grüne Feld). Teilen Sie ihn mit der Tierärztin oder dem Tierarzt — darüber treten Sie beide dem Videoanruf bei.", "Il n'y a qu'un seul lien, celui-ci (la case verte). Partagez-le avec le vétérinaire — c'est par là que vous rejoignez tous les deux l'appel vidéo.", "Há só um link, e é este (a caixa verde). Compartilhe com o veterinário — é por aqui que os dois entram na videochamada."],
  "Imprima este QR code e coloque na coleira do seu animal para máxima segurança.": ["Print this QR code and attach it to your pet's collar for maximum safety.", "Imprima este código QR y colóquelo en el collar de su mascota para máxima seguridad.", "Drucken Sie diesen QR-Code aus und befestigen Sie ihn am Halsband Ihres Tieres.", "Imprimez ce QR code et fixez-le au collier de votre animal pour plus de sécurité.", "Imprima este QR code e coloque na coleira do seu animal para máxima segurança."],
  "Informações": ["Information", "Información", "Informationen", "Informations", "Informações"],
  "Introduz o teu PIN para ver os parceiros e o desempenho de cada um.": ["Enter your PIN to see the partners and how each one is doing.", "Introduce tu PIN para ver los socios y el rendimiento de cada uno.", "Gib deine PIN ein, um die Partner und ihre Leistung zu sehen.", "Saisissez votre code PIN pour voir les partenaires et leurs performances.", "Digite o seu PIN para ver os parceiros e o desempenho de cada um."],
  "Ir para a Comunidade": ["Go to Community", "Ir a la Comunidad", "Zur Community", "Aller à la Communauté", "Ir para a Comunidade"],
  "Ir para a app": ["Go to the app", "Ir a la app", "Zur App", "Aller à l'application", "Ir para o app"],
  "Ir para consultas": ["Go to appointments", "Ir a consultas", "Zu den Terminen", "Aller aux rendez-vous", "Ir para consultas"],
  "Já dei / já fiz": ["Done / given", "Ya lo he dado / hecho", "Erledigt / gegeben", "Déjà donné / fait", "Já dei / já fiz"],
  "Já encontrei!": ["Found them!", "¡Ya lo encontré!", "Gefunden!", "Je l'ai retrouvé !", "Já encontrei!"],
  "Ligar ao Veterinário": ["Call the Vet", "Llamar al veterinario", "Tierarzt anrufen", "Appeler le vétérinaire", "Ligar para o veterinário"],
  "Limpar notificações": ["Clear notifications", "Borrar notificaciones", "Benachrichtigungen löschen", "Effacer les notifications", "Limpar notificações"],
  "Link da consulta (este verde é o único)": ["Appointment link (the green one is the only one)", "Enlace de la consulta (el verde es el único)", "Termin-Link (der grüne ist der einzige)", "Lien du rendez-vous (le vert est le seul)", "Link da consulta (este verde é o único)"],
  "Link para marcar consulta": ["Link to book an appointment", "Enlace para pedir cita", "Link zur Terminbuchung", "Lien pour prendre rendez-vous", "Link para marcar consulta"],
  "Local / Clínica": ["Place / Clinic", "Lugar / clínica", "Ort / Klinik", "Lieu / clinique", "Local / Clínica"],
  "Localização": ["Location", "Ubicación", "Standort", "Localisation", "Localização"],
  "Lote da vacina": ["Vaccine batch", "Lote de la vacuna", "Chargennummer des Impfstoffs", "Lot du vaccin", "Lote da vacina"],

  // ── Listas vazias, negócios, marketplace ──────────────────────────────
  "Manter o peso ideal é sinal de saúde e felicidade! 🐾💙": ["Keeping the ideal weight is a sign of health and happiness! 🐾💙", "¡Mantener el peso ideal es señal de salud y felicidad! 🐾💙", "Das Idealgewicht zu halten ist ein Zeichen für Gesundheit und Glück! 🐾💙", "Garder le poids idéal est signe de santé et de bonheur ! 🐾💙", "Manter o peso ideal é sinal de saúde e felicidade! 🐾💙"],
  "Medicação, tratamentos, vacinas e consultas": ["Medication, treatments, vaccines and appointments", "Medicación, tratamientos, vacunas y consultas", "Medikamente, Behandlungen, Impfungen und Termine", "Médicaments, traitements, vaccins et rendez-vous", "Medicação, tratamentos, vacinas e consultas"],
  "Motivo / Título *": ["Reason / Title *", "Motivo / título *", "Grund / Titel *", "Motif / Titre *", "Motivo / Título *"],
  "Médico veterinário": ["Veterinarian", "Veterinario", "Tierärztin / Tierarzt", "Vétérinaire", "Médico veterinário"],
  "Mínimo": ["Minimum", "Mínimo", "Minimum", "Minimum", "Mínimo"],
  "Mínimo 8 caracteres": ["At least 8 characters", "Mínimo 8 caracteres", "Mindestens 8 Zeichen", "8 caractères minimum", "Mínimo 8 caracteres"],
  "Negócios": ["Businesses", "Negocios", "Unternehmen", "Entreprises", "Negócios"],
  "Nenhum animal disponível para adoção neste momento.": ["No pets available for adoption right now.", "No hay mascotas disponibles para adopción en este momento.", "Zurzeit sind keine Tiere zur Adoption verfügbar.", "Aucun animal disponible à l'adoption pour le moment.", "Nenhum animal disponível para adoção neste momento."],
  "Nenhum animal perdido": ["No lost pets", "Ninguna mascota perdida", "Keine vermissten Tiere", "Aucun animal perdu", "Nenhum animal perdido"],
  "Nenhum anúncio encontrado": ["No listings found", "No se han encontrado anuncios", "Keine Anzeigen gefunden", "Aucune annonce trouvée", "Nenhum anúncio encontrado"],
  "Nenhum documento. Adicione passaporte, licenças, exames ou outros documentos.": ["No documents. Add a passport, licences, test results or other documents.", "Sin documentos. Añada pasaporte, licencias, análisis u otros documentos.", "Keine Dokumente. Fügen Sie Heimtierausweis, Lizenzen, Befunde oder andere Dokumente hinzu.", "Aucun document. Ajoutez un passeport, des licences, des examens ou d'autres documents.", "Nenhum documento. Adicione passaporte, licenças, exames ou outros documentos."],
  "Nenhum peso registado. Acompanhe o crescimento do seu animal.": ["No weight recorded. Track your pet's growth.", "No hay pesos registrados. Siga el crecimiento de su mascota.", "Kein Gewicht erfasst. Verfolgen Sie das Wachstum Ihres Tieres.", "Aucun poids enregistré. Suivez la croissance de votre animal.", "Nenhum peso registrado. Acompanhe o crescimento do seu animal."],
  "Nenhuma desparasitação registada.": ["No deworming recorded.", "No hay desparasitaciones registradas.", "Keine Entwurmung erfasst.", "Aucune vermifugation enregistrée.", "Nenhuma vermifugação registrada."],
  "Nenhuma entrada no diário de saúde. Registe sintomas, comportamentos, medicações e mais.": ["No health diary entries. Record symptoms, behaviour, medication and more.", "No hay entradas en el diario de salud. Registre síntomas, comportamientos, medicación y más.", "Keine Einträge im Gesundheitstagebuch. Erfassen Sie Symptome, Verhalten, Medikamente und mehr.", "Aucune entrée dans le journal de santé. Notez symptômes, comportements, médicaments et plus.", "Nenhuma entrada no diário de saúde. Registre sintomas, comportamentos, medicações e mais."],
  "Nenhuma raça encontrada": ["No breed found", "No se ha encontrado ninguna raza", "Keine Rasse gefunden", "Aucune race trouvée", "Nenhuma raça encontrada"],
  "Nenhuma receita médica. Tire uma foto ou faça upload da receita.": ["No prescriptions. Take a photo or upload the prescription.", "No hay recetas médicas. Haga una foto o suba la receta.", "Keine Rezepte. Machen Sie ein Foto oder laden Sie das Rezept hoch.", "Aucune ordonnance. Prenez une photo ou téléversez l'ordonnance.", "Nenhuma receita médica. Tire uma foto ou faça upload da receita."],
  "Nenhuma vacina registada. Adicione a caderneta de vacinação do seu animal.": ["No vaccines recorded. Add your pet's vaccination record.", "No hay vacunas registradas. Añada la cartilla de vacunación de su mascota.", "Keine Impfungen erfasst. Fügen Sie den Impfpass Ihres Tieres hinzu.", "Aucun vaccin enregistré. Ajoutez le carnet de vaccination de votre animal.", "Nenhuma vacina registrada. Adicione a carteira de vacinação do seu animal."],
  "Nome": ["Name", "Nombre", "Name", "Nom", "Nome"],
  "Nome *": ["Name *", "Nombre *", "Name *", "Nom *", "Nome *"],
  "Nome completo": ["Full name", "Nombre completo", "Vollständiger Name", "Nom complet", "Nome completo"],
  "Nome da clínica": ["Clinic name", "Nombre de la clínica", "Name der Klinik", "Nom de la clinique", "Nome da clínica"],
  "Nome da vacina *": ["Vaccine name *", "Nombre de la vacuna *", "Name des Impfstoffs *", "Nom du vaccin *", "Nome da vacina *"],
  "Nome do médico veterinário": ["Veterinarian's name", "Nombre del veterinario", "Name der Tierärztin / des Tierarztes", "Nom du vétérinaire", "Nome do médico veterinário"],
  "Nome do negócio *": ["Business name *", "Nombre del negocio *", "Name des Unternehmens *", "Nom de l'entreprise *", "Nome do negócio *"],
  "Nome do parceiro": ["Partner name", "Nombre del socio", "Name des Partners", "Nom du partenaire", "Nome do parceiro"],
  "Nome do veterinário": ["Vet's name", "Nombre del veterinario", "Name des Tierarztes", "Nom du vétérinaire", "Nome do veterinário"],
  "Nome do veterinário (opcional)": ["Vet's name (optional)", "Nombre del veterinario (opcional)", "Name des Tierarztes (optional)", "Nom du vétérinaire (facultatif)", "Nome do veterinário (opcional)"],
  "Nossas Missões": ["Our Missions", "Nuestras misiones", "Unsere Missionen", "Nos missions", "Nossas missões"],
  "Notificações 🔔": ["Notifications 🔔", "Notificaciones 🔔", "Benachrichtigungen 🔔", "Notifications 🔔", "Notificações 🔔"],
  "Nova Consulta": ["New Appointment", "Nueva consulta", "Neuer Termin", "Nouveau rendez-vous", "Nova consulta"],
  "Nova Consulta 📅": ["New Appointment 📅", "Nueva consulta 📅", "Neuer Termin 📅", "Nouveau rendez-vous 📅", "Nova consulta 📅"],
  "Nova Desparasitação": ["New Deworming", "Nueva desparasitación", "Neue Entwurmung", "Nouvelle vermifugation", "Nova vermifugação"],
  "Nova Receita Médica": ["New Prescription", "Nueva receta médica", "Neues Rezept", "Nouvelle ordonnance", "Nova receita médica"],
  "Nova Vacina": ["New Vaccine", "Nueva vacuna", "Neue Impfung", "Nouveau vaccin", "Nova vacina"],
  "Nova Vacina 💉": ["New Vaccine 💉", "Nueva vacuna 💉", "Neue Impfung 💉", "Nouveau vaccin 💉", "Nova vacina 💉"],
  "Nova missão": ["New mission", "Nueva misión", "Neue Mission", "Nouvelle mission", "Nova missão"],
  "Novo Anúncio": ["New Listing", "Nuevo anuncio", "Neue Anzeige", "Nouvelle annonce", "Novo anúncio"],
  "Novo Documento": ["New Document", "Nuevo documento", "Neues Dokument", "Nouveau document", "Novo documento"],
  "Novo código": ["New code", "Nuevo código", "Neuer Code", "Nouveau code", "Novo código"],
  "Novo código para dar aos seguidores": ["New code to give to followers", "Nuevo código para dar a los seguidores", "Neuer Code für die Follower", "Nouveau code à donner aux abonnés", "Novo código para dar aos seguidores"],
  "Novo lembrete": ["New reminder", "Nuevo recordatorio", "Neue Erinnerung", "Nouveau rappel", "Novo lembrete"],
  "Novo parceiro": ["New partner", "Nuevo socio", "Neuer Partner", "Nouveau partenaire", "Novo parceiro"],
  "Não": ["No", "No", "Nein", "Non", "Não"],
  "Número de lote": ["Batch number", "Número de lote", "Chargennummer", "Numéro de lot", "Número de lote"],
  "O anúncio foi publicado com sucesso.": ["The listing was published successfully.", "El anuncio se ha publicado con éxito.", "Die Anzeige wurde erfolgreich veröffentlicht.", "L'annonce a été publiée avec succès.", "O anúncio foi publicado com sucesso."],
  "O email não pode ser alterado aqui": ["The email cannot be changed here", "El email no se puede cambiar aquí", "Die E-Mail-Adresse kann hier nicht geändert werden", "L'e-mail ne peut pas être modifié ici", "O e-mail não pode ser alterado aqui"],
  "O que QUEM USA recebe": ["What the USER gets", "Lo que recibe QUIEN LO USA", "Was die NUTZERIN oder der NUTZER bekommt", "Ce que reçoit L'UTILISATEUR", "O que QUEM USA recebe"],
  "O que o PARCEIRO recebe": ["What the PARTNER gets", "Lo que recibe EL SOCIO", "Was der PARTNER bekommt", "Ce que reçoit LE PARTENAIRE", "O que o PARCEIRO recebe"],
  "O que precisa": ["What you need", "Lo que necesita", "Was Sie brauchen", "Ce dont vous avez besoin", "O que você precisa"],
  "O que quer registar?": ["What do you want to record?", "¿Qué quiere registrar?", "Was möchten Sie erfassen?", "Que souhaitez-vous enregistrer ?", "O que quer registrar?"],
  "O seu animal já voltou para casa? 🏠": ["Has your pet come home? 🏠", "¿Su mascota ya ha vuelto a casa? 🏠", "Ist Ihr Tier schon wieder zu Hause? 🏠", "Votre animal est-il rentré à la maison ? 🏠", "O seu animal já voltou para casa? 🏠"],
  "O seu anúncio foi publicado.": ["Your listing has been published.", "Su anuncio se ha publicado.", "Ihre Anzeige wurde veröffentlicht.", "Votre annonce a été publiée.", "O seu anúncio foi publicado."],
  "O seu anúncio será visível para toda a comunidade PetsLife. Certifique-se de que as informações são corretas.": ["Your listing will be visible to the whole PetsLife community. Make sure the information is correct.", "Su anuncio será visible para toda la comunidad PetsLife. Asegúrese de que la información es correcta.", "Ihre Anzeige ist für die gesamte PetsLife-Community sichtbar. Prüfen Sie, ob die Angaben stimmen.", "Votre annonce sera visible par toute la communauté PetsLife. Vérifiez que les informations sont correctes.", "O seu anúncio será visível para toda a comunidade PetsLife. Confira se as informações estão corretas."],
  "O seu nome": ["Your name", "Su nombre", "Ihr Name", "Votre nom", "O seu nome"],
  "O teu negócio já está visível para todos os utilizadores.": ["Your business is now visible to all users.", "Su negocio ya es visible para todos los usuarios.", "Ihr Unternehmen ist jetzt für alle Nutzer sichtbar.", "Votre entreprise est désormais visible par tous les utilisateurs.", "O seu negócio já está visível para todos os usuários."],
  "Observações, diagnóstico, tratamento...": ["Notes, diagnosis, treatment...", "Observaciones, diagnóstico, tratamiento...", "Notizen, Diagnose, Behandlung...", "Observations, diagnostic, traitement...", "Observações, diagnóstico, tratamento..."],
  "Observações...": ["Notes...", "Observaciones...", "Notizen...", "Observations...", "Observações..."],
  "Os avisos deste animal foram encerrados. 🐾": ["The alerts for this pet have been closed. 🐾", "Las alertas de esta mascota se han cerrado. 🐾", "Die Hinweise für dieses Tier wurden geschlossen. 🐾", "Les alertes de cet animal ont été clôturées. 🐾", "Os avisos deste animal foram encerrados. 🐾"],
  "Os guias da PetsLife são baseados em fontes veterinárias reconhecidas.": ["PetsLife guides are based on recognised veterinary sources.", "Las guías de PetsLife se basan en fuentes veterinarias reconocidas.", "Die PetsLife-Ratgeber beruhen auf anerkannten veterinärmedizinischen Quellen.", "Les guides PetsLife s'appuient sur des sources vétérinaires reconnues.", "Os guias da PetsLife são baseados em fontes veterinárias reconhecidas."],
  "Os meus animais": ["My pets", "Mis mascotas", "Meine Tiere", "Mes animaux", "Os meus animais"],
  "Os meus pets": ["My pets", "Mis mascotas", "Meine Tiere", "Mes animaux", "Os meus pets"],
  "Os teus animais estão com as vacinas e desparasitações em dia. Continua assim! 🐾": ["Your pets are up to date with vaccines and deworming. Keep it up! 🐾", "Tus mascotas están al día con las vacunas y desparasitaciones. ¡Sigue así! 🐾", "Deine Tiere sind bei Impfungen und Entwurmung auf dem neuesten Stand. Weiter so! 🐾", "Vos animaux sont à jour de vaccins et de vermifuges. Continuez ainsi ! 🐾", "Os seus animais estão com as vacinas e vermifugações em dia. Continue assim! 🐾"],
  "Partilhe este link com o veterinário. Os dois entram por ele — carregue no ícone para partilhar, ou em \"Entrar na chamada\" para entrar.": ["Share this link with the vet. You both join through it — tap the icon to share, or \"Join call\" to enter.", "Comparta este enlace con el veterinario. Los dos entran por él: pulse el icono para compartir o \"Entrar en la llamada\" para entrar.", "Teilen Sie diesen Link mit dem Tierarzt. Sie treten beide darüber bei — tippen Sie zum Teilen auf das Symbol oder auf \"Anruf beitreten\".", "Partagez ce lien avec le vétérinaire. Vous le rejoignez tous les deux — appuyez sur l'icône pour partager, ou sur « Rejoindre l'appel ».", "Compartilhe este link com o veterinário. Os dois entram por ele — toque no ícone para compartilhar, ou em \"Entrar na chamada\"."],
  "Passo a passo": ["Step by step", "Paso a paso", "Schritt für Schritt", "Étape par étape", "Passo a passo"],
  "Perfil atualizado com sucesso!": ["Profile updated successfully!", "¡Perfil actualizado con éxito!", "Profil erfolgreich aktualisiert!", "Profil mis à jour avec succès !", "Perfil atualizado com sucesso!"],
  "Pesquisar animais perdidos...": ["Search lost pets...", "Buscar mascotas perdidas...", "Vermisste Tiere suchen...", "Rechercher des animaux perdus...", "Pesquisar animais perdidos..."],
  "Pesquisar animais...": ["Search pets...", "Buscar mascotas...", "Tiere suchen...", "Rechercher des animaux...", "Pesquisar animais..."],
  "Pesquisar clínicas...": ["Search clinics...", "Buscar clínicas...", "Kliniken suchen...", "Rechercher des cliniques...", "Pesquisar clínicas..."],
  "Pesquisar hotéis...": ["Search hotels...", "Buscar hoteles...", "Hotels suchen...", "Rechercher des hôtels...", "Pesquisar hotéis..."],
  "Pesquisar negócios...": ["Search businesses...", "Buscar negocios...", "Unternehmen suchen...", "Rechercher des entreprises...", "Pesquisar negócios..."],
  "Pesquisar perto de si": ["Search near you", "Buscar cerca de usted", "In Ihrer Nähe suchen", "Rechercher près de chez vous", "Pesquisar perto de você"],
  "Pesquisar raça...": ["Search breed...", "Buscar raza...", "Rasse suchen...", "Rechercher une race...", "Pesquisar raça..."],
  "Pesquisar serviços...": ["Search services...", "Buscar servicios...", "Dienste suchen...", "Rechercher des services...", "Pesquisar serviços..."],
  "Preenche o nome, localização e contacto": ["Fill in the name, location and contact", "Rellena el nombre, la ubicación y el contacto", "Name, Ort und Kontakt ausfüllen", "Renseignez le nom, le lieu et le contact", "Preencha o nome, localização e contato"],
  "Preço (€)": ["Price (€)", "Precio (€)", "Preis (€)", "Prix (€)", "Preço (€)"],
  "Produtos recomendados para o seu animal": ["Recommended products for your pet", "Productos recomendados para su mascota", "Empfohlene Produkte für Ihr Tier", "Produits recommandés pour votre animal", "Produtos recomendados para o seu animal"],
  "Pronta para agendar?": ["Ready to book?", "¿Lista para reservar?", "Bereit für einen Termin?", "Prêt à réserver ?", "Pronta para agendar?"],
  "Proteger o seu bichinho é o maior ato de amor! 🐾✨": ["Protecting your pet is the greatest act of love! 🐾✨", "¡Proteger a su mascota es el mayor acto de amor! 🐾✨", "Ihr Tier zu schützen ist der größte Liebesbeweis! 🐾✨", "Protéger votre animal est le plus grand acte d'amour ! 🐾✨", "Proteger o seu bichinho é o maior ato de amor! 🐾✨"],
  "Próxima aplicação": ["Next application", "Próxima aplicación", "Nächste Anwendung", "Prochaine application", "Próxima aplicação"],
  "Próxima dose": ["Next dose", "Próxima dosis", "Nächste Dosis", "Prochaine dose", "Próxima dose"],
  "Próximas consultas": ["Upcoming appointments", "Próximas consultas", "Nächste Termine", "Prochains rendez-vous", "Próximas consultas"],
  "Publica um anúncio para ajudar!": ["Post a listing to help!", "¡Publica un anuncio para ayudar!", "Poste eine Anzeige und hilf mit!", "Publiez une annonce pour aider !", "Publique um anúncio para ajudar!"],
  "Publicar Anúncio": ["Post Listing", "Publicar anuncio", "Anzeige aufgeben", "Publier l'annonce", "Publicar anúncio"],
  "QR Code do Animal": ["Pet QR Code", "Código QR de la mascota", "QR-Code des Tieres", "QR code de l'animal", "QR Code do animal"],
  "QR Code não gerado ainda.": ["QR code not generated yet.", "El código QR aún no se ha generado.", "QR-Code wurde noch nicht erstellt.", "QR code pas encore généré.", "QR Code não gerado ainda."],

  // ── Perfil, conta, subscrição, avisos ─────────────────────────────────
  "Quando entrar na chamada pela primeira vez, o browser vai pedir permissão para aceder à câmara e ao microfone.": ["The first time you join the call, the browser will ask for permission to use the camera and microphone.", "La primera vez que entre en la llamada, el navegador pedirá permiso para acceder a la cámara y al micrófono.", "Beim ersten Beitritt fragt der Browser nach Zugriff auf Kamera und Mikrofon.", "La première fois que vous rejoignez l'appel, le navigateur demandera l'autorisation d'accéder à la caméra et au micro.", "Quando entrar na chamada pela primeira vez, o navegador vai pedir permissão para acessar a câmera e o microfone."],
  "Que alívio!": ["What a relief!", "¡Qué alivio!", "Was für eine Erleichterung!", "Quel soulagement !", "Que alívio!"],
  "Raça": ["Breed", "Raza", "Rasse", "Race", "Raça"],
  "Reações, observações...": ["Reactions, notes...", "Reacciones, observaciones...", "Reaktionen, Notizen...", "Réactions, observations...", "Reações, observações..."],
  "Recebeste um código de um parceiro ou influencer? Introduz aqui para activar o teu benefício.": ["Got a code from a partner or influencer? Enter it here to activate your benefit.", "¿Has recibido un código de un socio o influencer? Introdúcelo aquí para activar tu beneficio.", "Hast du einen Code von einem Partner oder Influencer? Gib ihn hier ein, um deinen Vorteil zu aktivieren.", "Vous avez reçu un code d'un partenaire ou d'un influenceur ? Saisissez-le ici pour activer votre avantage.", "Recebeu um código de um parceiro ou influenciador? Digite aqui para ativar o seu benefício."],
  "Regista a tua clínica ou petshop!": ["Register your clinic or pet shop!", "¡Registra tu clínica o tienda de mascotas!", "Registriere deine Praxis oder deinen Tierladen!", "Enregistrez votre clinique ou votre animalerie !", "Cadastre a sua clínica ou petshop!"],
  "Registar Negócio": ["Register Business", "Registrar negocio", "Unternehmen anmelden", "Enregistrer l'entreprise", "Cadastrar negócio"],
  "Registe a caderneta de vacinação": ["Record the vaccination book", "Registre la cartilla de vacunación", "Impfpass erfassen", "Enregistrez le carnet de vaccination", "Registre a carteira de vacinação"],
  "Registe a caderneta de vacinação do seu bichinho! Cada vacina é um ato de amor 🐾": ["Record your pet's vaccination book! Every vaccine is an act of love 🐾", "¡Registre la cartilla de vacunación de su mascota! Cada vacuna es un acto de amor 🐾", "Erfassen Sie den Impfpass Ihres Tieres! Jede Impfung ist ein Liebesbeweis 🐾", "Enregistrez le carnet de vaccination de votre animal ! Chaque vaccin est un acte d'amour 🐾", "Registre a carteira de vacinação do seu bichinho! Cada vacina é um ato de amor 🐾"],
  "Registe as consultas do seu bichinho aqui! Cada visita ao veterinário é um ato de amor 🩺": ["Record your pet's appointments here! Every vet visit is an act of love 🩺", "¡Registre aquí las consultas de su mascota! Cada visita al veterinario es un acto de amor 🩺", "Erfassen Sie hier die Termine Ihres Tieres! Jeder Tierarztbesuch ist ein Liebesbeweis 🩺", "Enregistrez ici les rendez-vous de votre animal ! Chaque visite chez le vétérinaire est un acte d'amour 🩺", "Registre as consultas do seu bichinho aqui! Cada visita ao veterinário é um ato de amor 🩺"],
  "Registe as desparasitações internas e externas do seu animal! 🛡️": ["Record your pet's internal and external deworming! 🛡️", "¡Registre las desparasitaciones internas y externas de su mascota! 🛡️", "Erfassen Sie die innere und äußere Entwurmung Ihres Tieres! 🛡️", "Enregistrez les vermifugations internes et externes de votre animal ! 🛡️", "Registre as vermifugações internas e externas do seu animal! 🛡️"],
  "Registe o peso regularmente para acompanhar o crescimento saudável do seu bichinho! 📏": ["Record the weight regularly to follow your pet's healthy growth! 📏", "¡Registre el peso con regularidad para seguir el crecimiento sano de su mascota! 📏", "Erfassen Sie das Gewicht regelmäßig, um das gesunde Wachstum Ihres Tieres zu verfolgen! 📏", "Enregistrez le poids régulièrement pour suivre la croissance de votre animal ! 📏", "Registre o peso regularmente para acompanhar o crescimento saudável do seu bichinho! 📏"],
  "Registe os momentos, sintomas e aventuras do seu bichinho! Cada entrada é uma memória 🐾💕": ["Record your pet's moments, symptoms and adventures! Every entry is a memory 🐾💕", "¡Registre los momentos, síntomas y aventuras de su mascota! Cada entrada es un recuerdo 🐾💕", "Halten Sie Momente, Symptome und Abenteuer Ihres Tieres fest! Jeder Eintrag ist eine Erinnerung 🐾💕", "Notez les moments, symptômes et aventures de votre animal ! Chaque entrée est un souvenir 🐾💕", "Registre os momentos, sintomas e aventuras do seu bichinho! Cada entrada é uma memória 🐾💕"],
  "Registe-se grátis": ["Sign up free", "Regístrese gratis", "Kostenlos registrieren", "Inscrivez-vous gratuitement", "Cadastre-se grátis"],
  "Rua, número, andar": ["Street, number, floor", "Calle, número, piso", "Straße, Hausnummer, Etage", "Rue, numéro, étage", "Rua, número, andar"],
  "Rua, número, código postal": ["Street, number, postcode", "Calle, número, código postal", "Straße, Hausnummer, PLZ", "Rue, numéro, code postal", "Rua, número, CEP"],
  "Sair da conta": ["Sign out", "Cerrar sesión", "Abmelden", "Se déconnecter", "Sair da conta"],
  "Saúde": ["Health", "Salud", "Gesundheit", "Santé", "Saúde"],
  "Saúde 🏥": ["Health 🏥", "Salud 🏥", "Gesundheit 🏥", "Santé 🏥", "Saúde 🏥"],
  "Se o seu animal se perder, quem o encontrar pode ler este código para aceder ao seu perfil e contactá-lo.": ["If your pet gets lost, whoever finds it can scan this code to see the profile and contact you.", "Si su mascota se pierde, quien la encuentre puede leer este código para ver su perfil y contactarle.", "Wenn Ihr Tier verloren geht, kann der Finder diesen Code scannen, um das Profil zu sehen und Sie zu kontaktieren.", "Si votre animal se perd, la personne qui le trouve peut scanner ce code pour voir son profil et vous contacter.", "Se o seu animal se perder, quem o encontrar pode ler este código para acessar o perfil e entrar em contato."],
  "Seja o primeiro a registar uma clínica!": ["Be the first to register a clinic!", "¡Sea el primero en registrar una clínica!", "Seien Sie der Erste, der eine Praxis registriert!", "Soyez le premier à enregistrer une clinique !", "Seja o primeiro a cadastrar uma clínica!"],
  "Seja o primeiro a registar uma petshop!": ["Be the first to register a pet shop!", "¡Sea el primero en registrar una tienda de mascotas!", "Seien Sie der Erste, der einen Tierladen registriert!", "Soyez le premier à enregistrer une animalerie !", "Seja o primeiro a cadastrar uma petshop!"],
  "Sem animais": ["No pets", "Sin mascotas", "Keine Tiere", "Aucun animal", "Sem animais"],
  "Sem animais para adoção": ["No pets for adoption", "Sin mascotas en adopción", "Keine Tiere zur Adoption", "Aucun animal à adopter", "Sem animais para adoção"],
  "Sem animais registados": ["No pets registered", "Sin mascotas registradas", "Keine Tiere registriert", "Aucun animal enregistré", "Sem animais cadastrados"],
  "Sem clínicas encontradas": ["No clinics found", "No se han encontrado clínicas", "Keine Kliniken gefunden", "Aucune clinique trouvée", "Sem clínicas encontradas"],
  "Sem contacto disponível": ["No contact available", "Sin contacto disponible", "Kein Kontakt verfügbar", "Aucun contact disponible", "Sem contato disponível"],
  "Sem denúncias": ["No reports", "Sin denuncias", "Keine Meldungen", "Aucun signalement", "Sem denúncias"],
  "Sem deslocações. Sem esperas. Fale com o veterinário em directo por videochamada, directamente aqui na app — gratuito e sem instalações.": ["No travelling. No waiting. Talk to the vet live by video call, right here in the app — free and with no installs.", "Sin desplazamientos. Sin esperas. Hable con el veterinario en directo por videollamada, aquí mismo en la app: gratis y sin instalaciones.", "Keine Fahrt. Keine Wartezeit. Sprechen Sie live per Videoanruf direkt in der App mit dem Tierarzt — kostenlos und ohne Installation.", "Sans déplacement. Sans attente. Parlez au vétérinaire en direct par visioconférence, ici dans l'application — gratuit et sans installation.", "Sem deslocamentos. Sem esperas. Fale com o veterinário ao vivo por videochamada, direto no app — gratuito e sem instalações."],
  "Sem hotéis disponíveis": ["No hotels available", "Sin hoteles disponibles", "Keine Hotels verfügbar", "Aucun hôtel disponible", "Sem hotéis disponíveis"],
  "Sem negócios ainda": ["No businesses yet", "Todavía sin negocios", "Noch keine Unternehmen", "Pas encore d'entreprises", "Sem negócios ainda"],
  "Sem registos de peso": ["No weight records", "Sin registros de peso", "Keine Gewichtseinträge", "Aucun enregistrement de poids", "Sem registros de peso"],
  "Sem registos neste período": ["No records in this period", "Sin registros en este periodo", "Keine Einträge in diesem Zeitraum", "Aucun enregistrement sur cette période", "Sem registros neste período"],
  "Sem serviços disponíveis": ["No services available", "Sin servicios disponibles", "Keine Dienste verfügbar", "Aucun service disponible", "Sem serviços disponíveis"],
  "Sem tosquiadores disponíveis": ["No groomers available", "Sin peluqueros caninos disponibles", "Keine Hundefriseure verfügbar", "Aucun toiletteur disponible", "Sem tosadores disponíveis"],
  "Sem treinadores disponíveis": ["No trainers available", "Sin adiestradores disponibles", "Keine Trainer verfügbar", "Aucun éducateur disponible", "Sem adestradores disponíveis"],
  "Serviços": ["Services", "Servicios", "Leistungen", "Services", "Serviços"],
  "Serviços e preços": ["Services and prices", "Servicios y precios", "Leistungen und Preise", "Services et tarifs", "Serviços e preços"],
  "Serviços especializados para o seu pet": ["Specialist services for your pet", "Servicios especializados para su mascota", "Spezialisierte Dienste für Ihr Tier", "Services spécialisés pour votre animal", "Serviços especializados para o seu pet"],
  "Sim, cancelar": ["Yes, cancel", "Sí, cancelar", "Ja, abbrechen", "Oui, annuler", "Sim, cancelar"],
  "Sim, já está em casa": ["Yes, they're home", "Sí, ya está en casa", "Ja, es ist zu Hause", "Oui, il est rentré", "Sim, já está em casa"],
  "Sobre os nossos conteúdos": ["About our content", "Sobre nuestros contenidos", "Über unsere Inhalte", "À propos de nos contenus", "Sobre os nossos conteúdos"],
  "Telefone para marcações": ["Booking phone number", "Teléfono para citas", "Telefon für Terminvereinbarung", "Téléphone pour les rendez-vous", "Telefone para agendamentos"],
  "Tem a certeza que quer eliminar esta consulta?": ["Are you sure you want to delete this appointment?", "¿Seguro que quiere eliminar esta consulta?", "Möchten Sie diesen Termin wirklich löschen?", "Voulez-vous vraiment supprimer ce rendez-vous ?", "Tem certeza de que quer excluir esta consulta?"],
  "Tem a certeza que quer sair?": ["Are you sure you want to sign out?", "¿Seguro que quiere cerrar sesión?", "Möchten Sie sich wirklich abmelden?", "Voulez-vous vraiment vous déconnecter ?", "Tem certeza de que quer sair?"],
  "Tem a certeza?": ["Are you sure?", "¿Está seguro?", "Sind Sie sicher?", "Êtes-vous sûr ?", "Tem certeza?"],
  "Tem a certeza? Esta ação não pode ser desfeita.": ["Are you sure? This action cannot be undone.", "¿Está seguro? Esta acción no se puede deshacer.", "Sind Sie sicher? Diese Aktion kann nicht rückgängig gemacht werden.", "Êtes-vous sûr ? Cette action est irréversible.", "Tem certeza? Esta ação não pode ser desfeita."],
  "Tipo de consulta": ["Appointment type", "Tipo de consulta", "Art des Termins", "Type de rendez-vous", "Tipo de consulta"],
  "Tipo de documento": ["Document type", "Tipo de documento", "Art des Dokuments", "Type de document", "Tipo de documento"],
  "Tire uma foto às receitas do veterinário para as ter sempre à mão! 📱": ["Take a photo of the vet's prescriptions to always have them at hand! 📱", "¡Haga una foto de las recetas del veterinario para tenerlas siempre a mano! 📱", "Fotografieren Sie die Rezepte des Tierarztes, damit Sie sie immer zur Hand haben! 📱", "Prenez en photo les ordonnances du vétérinaire pour les avoir toujours sous la main ! 📱", "Tire uma foto das receitas do veterinário para tê-las sempre à mão! 📱"],
  "Todos os documentos do seu bichinho organizadinhos! 📁🐾": ["All your pet's documents neatly organised! 📁🐾", "¡Todos los documentos de su mascota bien organizados! 📁🐾", "Alle Dokumente Ihres Tieres schön geordnet! 📁🐾", "Tous les documents de votre animal bien rangés ! 📁🐾", "Todos os documentos do seu bichinho organizadinhos! 📁🐾"],
  "Trabalho social da PetsLife 🐾": ["PetsLife community work 🐾", "Labor social de PetsLife 🐾", "Soziales Engagement von PetsLife 🐾", "Action sociale de PetsLife 🐾", "Trabalho social da PetsLife 🐾"],
  "Treinadores profissionais para o seu pet": ["Professional trainers for your pet", "Adiestradores profesionales para su mascota", "Professionelle Trainer für Ihr Tier", "Éducateurs professionnels pour votre animal", "Adestradores profissionais para o seu pet"],
  "Tudo em dia!": ["All up to date!", "¡Todo al día!", "Alles auf dem neuesten Stand!", "Tout est à jour !", "Tudo em dia!"],
  "Tudo o que o seu animal precisa": ["Everything your pet needs", "Todo lo que su mascota necesita", "Alles, was Ihr Tier braucht", "Tout ce dont votre animal a besoin", "Tudo o que o seu animal precisa"],
  "Título": ["Title", "Título", "Titel", "Titre", "Título"],
  "Título *": ["Title *", "Título *", "Titel *", "Titre *", "Título *"],
  "Título / Medicamento *": ["Title / Medicine *", "Título / medicamento *", "Titel / Medikament *", "Titre / Médicament *", "Título / Medicamento *"],
  "Título / Nome *": ["Title / Name *", "Título / nombre *", "Titel / Name *", "Titre / Nom *", "Título / Nome *"],
  "Título da missão": ["Mission title", "Título de la misión", "Titel der Mission", "Titre de la mission", "Título da missão"],
  "Vacina adicionada com sucesso.": ["Vaccine added successfully.", "Vacuna añadida con éxito.", "Impfung erfolgreich hinzugefügt.", "Vaccin ajouté avec succès.", "Vacina adicionada com sucesso."],
  "Variação": ["Change", "Variación", "Veränderung", "Variation", "Variação"],
  "Ver Online": ["View Online", "Ver online", "Online ansehen", "Voir en ligne", "Ver online"],
  "Ver no Mapa": ["View on Map", "Ver en el mapa", "Auf der Karte ansehen", "Voir sur la carte", "Ver no mapa"],
  "Ver vídeo no YouTube": ["Watch video on YouTube", "Ver vídeo en YouTube", "Video auf YouTube ansehen", "Voir la vidéo sur YouTube", "Ver vídeo no YouTube"],
  "Ver →": ["View →", "Ver →", "Ansehen →", "Voir →", "Ver →"],
  "Verifica a tua caixa de entrada e segue as instruções para redefinir a tua password.": ["Check your inbox and follow the instructions to reset your password.", "Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.", "Sieh in deinem Posteingang nach und folge der Anleitung, um dein Passwort zurückzusetzen.", "Consultez votre boîte de réception et suivez les instructions pour réinitialiser votre mot de passe.", "Verifique a sua caixa de entrada e siga as instruções para redefinir a sua senha."],
  "Veterinário": ["Vet", "Veterinario", "Tierarzt", "Vétérinaire", "Veterinário"],
  "Vá ao separador de consultas e carregue no + para marcar a sua primeira consulta online.": ["Go to the appointments tab and tap + to book your first online appointment.", "Vaya a la pestaña de consultas y pulse + para reservar su primera consulta online.", "Gehen Sie zum Tab Termine und tippen Sie auf +, um Ihren ersten Online-Termin zu buchen.", "Allez dans l'onglet des rendez-vous et appuyez sur + pour réserver votre première consultation en ligne.", "Vá na aba de consultas e toque no + para marcar a sua primeira consulta online."],
  "email@exemplo.com": ["email@example.com", "correo@ejemplo.com", "email@beispiel.de", "email@exemple.com", "email@exemplo.com"],
  "esta publicação": ["this post", "esta publicación", "diesen Beitrag", "cette publication", "esta publicação"],
  "este anúncio": ["this listing", "este anuncio", "diese Anzeige", "cette annonce", "este anúncio"],
  "ex: Após consulta veterinária": ["e.g. After the vet appointment", "Ej.: Tras la consulta veterinaria", "z. B. nach dem Tierarztbesuch", "Ex. : Après la consultation vétérinaire", "ex: Após consulta veterinária"],
  "o.seu@email.com": ["your@email.com", "su@email.com", "ihre@email.de", "votre@email.com", "o.seu@email.com"],
  "o.teu@email.com": ["your@email.com", "tu@email.com", "deine@email.de", "ton@email.com", "o.seu@email.com"],
  "Área reservada": ["Restricted area", "Área reservada", "Geschützter Bereich", "Espace réservé", "Área reservada"],
  "Ótimo! Nenhum relato de animal perdido por aqui.": ["Great! No lost pet reports around here.", "¡Genial! Ningún aviso de mascota perdida por aquí.", "Super! Keine Vermisstenmeldungen in der Nähe.", "Super ! Aucun signalement d'animal perdu par ici.", "Ótimo! Nenhum relato de animal perdido por aqui."],
  "€1.67/mês • Poupa 58%!": ["€1.67/month • Save 58%!", "1,67 €/mes • ¡Ahorra un 58 %!", "1,67 €/Monat • Spare 58 %!", "1,67 €/mois • Économisez 58 % !", "€1,67/mês • Economize 58%!"],
  "▶ Vídeo": ["▶ Video", "▶ Vídeo", "▶ Video", "▶ Vidéo", "▶ Vídeo"],
  "⚕️ Atenção à Saúde": ["⚕️ Health Watch", "⚕️ Atención a la salud", "⚕️ Auf die Gesundheit achten", "⚕️ Attention à la santé", "⚕️ Atenção à saúde"],
  "⚠️ Consulte sempre o seu veterinário antes de administrar qualquer medicamento ou suplemento ao seu animal.": ["⚠️ Always consult your vet before giving your pet any medicine or supplement.", "⚠️ Consulte siempre a su veterinario antes de administrar cualquier medicamento o suplemento a su mascota.", "⚠️ Fragen Sie immer Ihre Tierärztin oder Ihren Tierarzt, bevor Sie Ihrem Tier ein Medikament oder Ergänzungsmittel geben.", "⚠️ Consultez toujours votre vétérinaire avant de donner un médicament ou un complément à votre animal.", "⚠️ Consulte sempre o seu veterinário antes de administrar qualquer medicamento ou suplemento ao seu animal."],
  "✅ Avaliação enviada!": ["✅ Review sent!", "✅ ¡Valoración enviada!", "✅ Bewertung gesendet!", "✅ Avis envoyé !", "✅ Avaliação enviada!"],
  "✅ Negócio registado!": ["✅ Business registered!", "✅ ¡Negocio registrado!", "✅ Unternehmen registriert!", "✅ Entreprise enregistrée !", "✅ Negócio cadastrado!"],
  "✅ O que fazer": ["✅ What to do", "✅ Qué hacer", "✅ Was tun", "✅ Ce qu'il faut faire", "✅ O que fazer"],
  "❌ Não fazer": ["❌ What not to do", "❌ Qué no hacer", "❌ Was nicht tun", "❌ Ce qu'il ne faut pas faire", "❌ Não fazer"],
  "🏠 Ideal para": ["🏠 Ideal for", "🏠 Ideal para", "🏠 Ideal für", "🏠 Idéal pour", "🏠 Ideal para"],
  "💉 Nova Vacina": ["💉 New Vaccine", "💉 Nueva vacuna", "💉 Neue Impfung", "💉 Nouveau vaccin", "💉 Nova vacina"],
  "💊 Nova Receita": ["💊 New Prescription", "💊 Nueva receta", "💊 Neues Rezept", "💊 Nouvelle ordonnance", "💊 Nova receita"],
  "💡 Após agendar, receberá um link de videochamada gratuito visível aqui na app. Pode partilhá-lo com o veterinário.": ["💡 After booking you'll get a free video call link shown here in the app. You can share it with the vet.", "💡 Tras reservar recibirá un enlace de videollamada gratuito visible aquí en la app. Puede compartirlo con el veterinario.", "💡 Nach der Buchung erhalten Sie einen kostenlosen Videoanruf-Link, der hier in der App zu sehen ist. Sie können ihn mit dem Tierarzt teilen.", "💡 Après la réservation, vous recevrez un lien de visioconférence gratuit visible ici dans l'application. Vous pouvez le partager avec le vétérinaire.", "💡 Após agendar, você recebe um link de videochamada gratuito visível aqui no app. Pode compartilhar com o veterinário."],
  "💡 Dicas úteis": ["💡 Useful tips", "💡 Consejos útiles", "💡 Nützliche Tipps", "💡 Conseils utiles", "💡 Dicas úteis"],
  "💰 Preço indicativo": ["💰 Indicative price", "💰 Precio orientativo", "💰 Richtpreis", "💰 Prix indicatif", "💰 Preço indicativo"],
  "💾 Guardar Consulta": ["💾 Save Appointment", "💾 Guardar consulta", "💾 Termin speichern", "💾 Enregistrer le rendez-vous", "💾 Salvar consulta"],
  "💾 Guardar Registo": ["💾 Save Record", "💾 Guardar registro", "💾 Eintrag speichern", "💾 Enregistrer", "💾 Salvar registro"],
  "💾 Guardar Vacina": ["💾 Save Vaccine", "💾 Guardar vacuna", "💾 Impfung speichern", "💾 Enregistrer le vaccin", "💾 Salvar vacina"],
  "📄 Novo Documento": ["📄 New Document", "📄 Nuevo documento", "📄 Neues Dokument", "📄 Nouveau document", "📄 Novo documento"],
  "📅 Nova Consulta": ["📅 New Appointment", "📅 Nueva consulta", "📅 Neuer Termin", "📅 Nouveau rendez-vous", "📅 Nova consulta"],
  "📋 Descrição": ["📋 Description", "📋 Descripción", "📋 Beschreibung", "📋 Description", "📋 Descrição"],
  "📓 Nova Entrada": ["📓 New Entry", "📓 Nueva entrada", "📓 Neuer Eintrag", "📓 Nouvelle entrée", "📓 Nova entrada"],
  "📱 Android: Definições → Apps → Chrome → Permissões → Câmara e Microfone": ["📱 Android: Settings → Apps → Chrome → Permissions → Camera and Microphone", "📱 Android: Ajustes → Apps → Chrome → Permisos → Cámara y micrófono", "📱 Android: Einstellungen → Apps → Chrome → Berechtigungen → Kamera und Mikrofon", "📱 Android : Paramètres → Applications → Chrome → Autorisations → Caméra et micro", "📱 Android: Configurações → Apps → Chrome → Permissões → Câmera e Microfone"],
  "📱 iPhone: Definições → Safari → Câmara e Microfone → Perguntar": ["📱 iPhone: Settings → Safari → Camera and Microphone → Ask", "📱 iPhone: Ajustes → Safari → Cámara y micrófono → Preguntar", "📱 iPhone: Einstellungen → Safari → Kamera und Mikrofon → Fragen", "📱 iPhone : Réglages → Safari → Caméra et micro → Demander", "📱 iPhone: Ajustes → Safari → Câmera e Microfone → Perguntar"],
  "📷 Foto / Scan do documento": ["📷 Photo / scan of the document", "📷 Foto / escaneo del documento", "📷 Foto / Scan des Dokuments", "📷 Photo / scan du document", "📷 Foto / Scan do documento"],
  "📷 Foto da receita": ["📷 Photo of the prescription", "📷 Foto de la receta", "📷 Foto des Rezepts", "📷 Photo de l'ordonnance", "📷 Foto da receita"],
  "🔍 Animais Perdidos": ["🔍 Lost Pets", "🔍 Mascotas perdidas", "🔍 Vermisste Tiere", "🔍 Animaux perdus", "🔍 Animais perdidos"],
  "🚨 Ligar Vet Emergência 24h": ["🚨 Call 24h Emergency Vet", "🚨 Llamar veterinario de urgencias 24h", "🚨 24h-Notdienst anrufen", "🚨 Appeler le vétérinaire d'urgence 24h", "🚨 Ligar Vet Emergência 24h"],
  "🚨 Urgência Veterinária": ["🚨 Veterinary Emergency", "🚨 Urgencia veterinaria", "🚨 Tierärztlicher Notfall", "🚨 Urgence vétérinaire", "🚨 Urgência veterinária"],
  "🪱 Nova Desparasitação": ["🪱 New Deworming", "🪱 Nueva desparasitación", "🪱 Neue Entwurmung", "🪱 Nouvelle vermifugation", "🪱 Nova vermifugação"],
};

// ── Selector de idioma ────────────────────────────────────────────────
T["Idioma"] = ["Language", "Idioma", "Sprache", "Langue", "Idioma"];
T["Escolha o seu idioma preferido"] = ["Choose your preferred language", "Elija su idioma preferido", "Wählen Sie Ihre Sprache", "Choisissez votre langue", "Escolha o seu idioma preferido"];

// ── Segundo lote: palavras curtas e botões ────────────────────────────
T["+ Primeira entrada"] = ["+ First entry", "+ Primera entrada", "+ Erster Eintrag", "+ Première entrée", "+ Primeira entrada"];
T["+ Registar peso"] = ["+ Add weight", "+ Registrar peso", "+ Gewicht eintragen", "+ Ajouter un poids", "+ Registrar peso"];
T["/ano"] = ["/year", "/año", "/Jahr", "/an", "/ano"];
T["/mês"] = ["/month", "/mes", "/Monat", "/mois", "/mês"];
T["A denúncia foi enviada. A equipa vai analisar e tomar as medidas necessárias."] = ["The report has been sent. Our team will review it and take action.", "La denuncia se ha enviado. El equipo la revisará y tomará medidas.", "Die Meldung wurde gesendet. Das Team prüft sie und ergreift Maßnahmen.", "Le signalement a été envoyé. L'équipe va l'examiner et agir.", "A denúncia foi enviada. A equipe vai analisar e tomar as medidas necessárias."];
T["Abrir no Google Maps"] = ["Open in Google Maps", "Abrir en Google Maps", "In Google Maps öffnen", "Ouvrir dans Google Maps", "Abrir no Google Maps"];
T["Agendar consulta"] = ["Book appointment", "Reservar consulta", "Termin buchen", "Prendre rendez-vous", "Agendar consulta"];
T["Ainda sem mensagens"] = ["No messages yet", "Todavía sin mensajes", "Noch keine Nachrichten", "Pas encore de messages", "Ainda sem mensagens"];
T["Anual"] = ["Yearly", "Anual", "Jährlich", "Annuel", "Anual"];
T["Atual"] = ["Current", "Actual", "Aktuell", "Actuel", "Atual"];
T["Avaliar"] = ["Rate", "Valorar", "Bewerten", "Évaluer", "Avaliar"];
T["Caderneta / Comprovativo"] = ["Record book / proof", "Cartilla / comprobante", "Impfpass / Nachweis", "Carnet / justificatif", "Carteirinha / comprovante"];
T["Cancelar"] = ["Cancel", "Cancelar", "Abbrechen", "Annuler", "Cancelar"];
T["Cancele quando quiser. Sem compromisso."] = ["Cancel any time. No commitment.", "Cancele cuando quiera. Sin compromiso.", "Jederzeit kündbar. Ohne Verpflichtung.", "Annulez quand vous voulez. Sans engagement.", "Cancele quando quiser. Sem compromisso."];
T["Carregue em «Usar esta foto» para a guardar."] = ["Tap \"Use this photo\" to save it.", "Pulse «Usar esta foto» para guardarla.", "Tippen Sie auf \"Dieses Foto verwenden\", um es zu speichern.", "Appuyez sur « Utiliser cette photo » pour l'enregistrer.", "Toque em \"Usar esta foto\" para salvá-la."];
T["Carregue em «Usar esta foto» para a guardar. Se não for esta, pode escolher outra."] = ["Tap \"Use this photo\" to save it. If it's not the right one, pick another.", "Pulse «Usar esta foto» para guardarla. Si no es esta, puede elegir otra.", "Tippen Sie auf \"Dieses Foto verwenden\", um es zu speichern. Wenn es nicht passt, wählen Sie ein anderes.", "Appuyez sur « Utiliser cette photo » pour l'enregistrer. Sinon, choisissez-en une autre.", "Toque em \"Usar esta foto\" para salvá-la. Se não for esta, pode escolher outra."];
T["Categoria"] = ["Category", "Categoría", "Kategorie", "Catégorie", "Categoria"];
T["Categoria *"] = ["Category *", "Categoría *", "Kategorie *", "Catégorie *", "Categoria *"];
T["Cidade"] = ["City", "Ciudad", "Stadt", "Ville", "Cidade"];
T["Como funciona?"] = ["How does it work?", "¿Cómo funciona?", "Wie funktioniert das?", "Comment ça marche ?", "Como funciona?"];
T["Comunidade"] = ["Community", "Comunidad", "Community", "Communauté", "Comunidade"];
T["Consulta"] = ["Appointment", "Consulta", "Termin", "Rendez-vous", "Consulta"];
T["Consulta Online"] = ["Online Appointment", "Consulta online", "Online-Termin", "Consultation en ligne", "Consulta online"];
T["Consultas"] = ["Appointments", "Consultas", "Termine", "Rendez-vous", "Consultas"];
T["Contacto"] = ["Contact", "Contacto", "Kontakt", "Contact", "Contato"];
T["Contactos"] = ["Contacts", "Contactos", "Kontakte", "Contacts", "Contatos"];
T["Criar parceiro"] = ["Create partner", "Crear socio", "Partner anlegen", "Créer un partenaire", "Criar parceiro"];
T["Criar primeiro lembrete"] = ["Create first reminder", "Crear el primer recordatorio", "Erste Erinnerung erstellen", "Créer le premier rappel", "Criar primeiro lembrete"];
T["DD/MM/AAAA"] = ["DD/MM/YYYY", "DD/MM/AAAA", "TT.MM.JJJJ", "JJ/MM/AAAA", "DD/MM/AAAA"];
T["Data"] = ["Date", "Fecha", "Datum", "Date", "Data"];
T["Data *"] = ["Date *", "Fecha *", "Datum *", "Date *", "Data *"];
T["Denunciar conteúdo"] = ["Report content", "Denunciar contenido", "Inhalt melden", "Signaler le contenu", "Denunciar conteúdo"];
T["Documentos"] = ["Documents", "Documentos", "Dokumente", "Documents", "Documentos"];
T["Editar Perfil"] = ["Edit Profile", "Editar perfil", "Profil bearbeiten", "Modifier le profil", "Editar perfil"];
T["Editar consulta"] = ["Edit appointment", "Editar consulta", "Termin bearbeiten", "Modifier le rendez-vous", "Editar consulta"];
T["Editar perfil"] = ["Edit profile", "Editar perfil", "Profil bearbeiten", "Modifier le profil", "Editar perfil"];
T["Eliminar"] = ["Delete", "Eliminar", "Löschen", "Supprimer", "Excluir"];
T["Eliminar consulta"] = ["Delete appointment", "Eliminar consulta", "Termin löschen", "Supprimer le rendez-vous", "Excluir consulta"];
T["Email enviado!"] = ["Email sent!", "¡Email enviado!", "E-Mail gesendet!", "E-mail envoyé !", "E-mail enviado!"];
T["Email ou telefone"] = ["Email or phone", "Email o teléfono", "E-Mail oder Telefon", "E-mail ou téléphone", "E-mail ou telefone"];
T["Entrar"] = ["Sign in", "Entrar", "Anmelden", "Se connecter", "Entrar"];
T["Entrar agora"] = ["Sign in now", "Entrar ahora", "Jetzt anmelden", "Se connecter maintenant", "Entrar agora"];
T["Entrar na chamada"] = ["Join call", "Entrar en la llamada", "Anruf beitreten", "Rejoindre l'appel", "Entrar na chamada"];
T["Enviar link"] = ["Send link", "Enviar enlace", "Link senden", "Envoyer le lien", "Enviar link"];
T["Escolher ficheiro"] = ["Choose file", "Elegir archivo", "Datei wählen", "Choisir un fichier", "Escolher arquivo"];
T["Especialidade"] = ["Speciality", "Especialidad", "Fachgebiet", "Spécialité", "Especialidade"];
T["Ex: 1 comprimido, 5ml, 2 gotas"] = ["e.g. 1 tablet, 5ml, 2 drops", "Ej.: 1 comprimido, 5 ml, 2 gotas", "z. B. 1 Tablette, 5 ml, 2 Tropfen", "Ex. : 1 comprimé, 5 ml, 2 gouttes", "Ex: 1 comprimido, 5ml, 2 gotas"];
T["Ex: 40k seguidores Instagram"] = ["e.g. 40k Instagram followers", "Ej.: 40k seguidores en Instagram", "z. B. 40k Instagram-Follower", "Ex. : 40k abonnés Instagram", "Ex: 40k seguidores no Instagram"];
T["Ex: Amoxicilina, Pomada, Antipulgas"] = ["e.g. Amoxicillin, ointment, flea treatment", "Ej.: Amoxicilina, pomada, antipulgas", "z. B. Amoxicillin, Salbe, Flohmittel", "Ex. : Amoxicilline, pommade, antipuces", "Ex: Amoxicilina, Pomada, Antipulgas"];
T["Ex: Bola, Luna..."] = ["e.g. Buddy, Luna...", "Ej.: Bola, Luna...", "z. B. Bella, Luna...", "Ex. : Bella, Luna...", "Ex: Bola, Luna..."];
T["Ex: Brincou muito hoje! 🎉"] = ["e.g. Played a lot today! 🎉", "Ej.: ¡Hoy ha jugado mucho! 🎉", "z. B. Hat heute viel gespielt! 🎉", "Ex. : A beaucoup joué aujourd'hui ! 🎉", "Ex: Brincou muito hoje! 🎉"];
T["Ex: Consulta anual"] = ["e.g. Annual appointment", "Ej.: Consulta anual", "z. B. Jahrestermin", "Ex. : Consultation annuelle", "Ex: Consulta anual"];
T["Ex: Consulta geral €25, Vacina €15, Tosquia €30..."] = ["e.g. General consultation €25, vaccine €15, grooming €30...", "Ej.: Consulta general 25 €, vacuna 15 €, peluquería 30 €...", "z. B. Allgemeine Untersuchung 25 €, Impfung 15 €, Fellpflege 30 €...", "Ex. : Consultation 25 €, vaccin 15 €, toilettage 30 €...", "Ex: Consulta geral €25, Vacina €15, Tosa €30..."];
T["Ex: Frontline, Milbemax, Advocate..."] = ["e.g. Frontline, Milbemax, Advocate...", "Ej.: Frontline, Milbemax, Advocate...", "z. B. Frontline, Milbemax, Advocate...", "Ex. : Frontline, Milbemax, Advocate...", "Ex: Frontline, Milbemax, Advocate..."];
T["Ex: JOAO10"] = ["e.g. JOHN10", "Ej.: JUAN10", "z. B. JAN10", "Ex. : JEAN10", "Ex: JOAO10"];
T["Ex: Lisboa"] = ["e.g. London", "Ej.: Madrid", "z. B. Berlin", "Ex. : Paris", "Ex: São Paulo"];
T["Ex: Passaporte Europeu..."] = ["e.g. European passport...", "Ej.: Pasaporte europeo...", "z. B. EU-Heimtierausweis...", "Ex. : Passeport européen...", "Ex: Passaporte..."];
T["Ex: Stronghold, Advantage..."] = ["e.g. Stronghold, Advantage...", "Ej.: Stronghold, Advantage...", "z. B. Stronghold, Advantage...", "Ex. : Stronghold, Advantage...", "Ex: Stronghold, Advantage..."];
T["Ex: Tosse persistente"] = ["e.g. Persistent cough", "Ej.: Tos persistente", "z. B. anhaltender Husten", "Ex. : Toux persistante", "Ex: Tosse persistente"];
T["Explorar"] = ["Explore", "Explorar", "Entdecken", "Explorer", "Explorar"];
T["Fechar"] = ["Close", "Cerrar", "Schließen", "Fermer", "Fechar"];
T["Ferramentas"] = ["Tools", "Herramientas", "Werkzeuge", "Outils", "Ferramentas"];
T["Galeria"] = ["Gallery", "Galería", "Galerie", "Galerie", "Galeria"];
T["Guia"] = ["Guide", "Guía", "Leitfaden", "Guide", "Guia"];
T["Hoje"] = ["Today", "Hoy", "Heute", "Aujourd'hui", "Hoje"];
T["Hora"] = ["Time", "Hora", "Uhrzeit", "Heure", "Hora"];
T["Horas"] = ["Times", "Horas", "Uhrzeiten", "Heures", "Horários"];
T["Lembretes"] = ["Reminders", "Recordatorios", "Erinnerungen", "Rappels", "Lembretes"];
T["Ligar"] = ["Call", "Llamar", "Anrufen", "Appeler", "Ligar"];
T["Ligar 112"] = ["Call 112", "Llamar al 112", "112 anrufen", "Appeler le 112", "Ligar 112"];
T["Limpar"] = ["Clear", "Borrar", "Löschen", "Effacer", "Limpar"];
T["MELHOR VALOR"] = ["BEST VALUE", "MEJOR PRECIO", "BESTES ANGEBOT", "MEILLEUR PRIX", "MELHOR VALOR"];
T["Marcar Consulta"] = ["Book Appointment", "Pedir cita", "Termin buchen", "Prendre rendez-vous", "Marcar consulta"];
T["Marketplace"] = ["Marketplace", "Marketplace", "Marktplatz", "Marketplace", "Marketplace"];
T["Mensagens"] = ["Messages", "Mensajes", "Nachrichten", "Messages", "Mensagens"];
T["Mensal"] = ["Monthly", "Mensual", "Monatlich", "Mensuel", "Mensal"];
T["Morada"] = ["Address", "Dirección", "Adresse", "Adresse", "Endereço"];
T["Motivo *"] = ["Reason *", "Motivo *", "Grund *", "Motif *", "Motivo *"];
T["Motivo / Notas"] = ["Reason / Notes", "Motivo / notas", "Grund / Notizen", "Motif / Notes", "Motivo / Notas"];
T["Nenhum registo ainda"] = ["No records yet", "Todavía sin registros", "Noch keine Einträge", "Aucun enregistrement", "Nenhum registro ainda"];
T["Nenhuma consulta agendada"] = ["No appointments booked", "Ninguna consulta reservada", "Keine Termine gebucht", "Aucun rendez-vous prévu", "Nenhuma consulta agendada"];
T["Nenhuma consulta registada."] = ["No appointments recorded.", "No hay consultas registradas.", "Keine Termine erfasst.", "Aucun rendez-vous enregistré.", "Nenhuma consulta registrada."];
T["Notas"] = ["Notes", "Notas", "Notizen", "Notes", "Notas"];
T["Notas / Motivo"] = ["Notes / Reason", "Notas / motivo", "Notizen / Grund", "Notes / Motif", "Notas / Motivo"];
T["Notas / Posologia"] = ["Notes / Dosage", "Notas / posología", "Notizen / Dosierung", "Notes / Posologie", "Notas / Posologia"];
T["Notas / Resultados"] = ["Notes / Results", "Notas / resultados", "Notizen / Ergebnisse", "Notes / Résultats", "Notas / Resultados"];
T["Nº Microchip"] = ["Microchip no.", "N.º de microchip", "Mikrochip-Nr.", "N° de puce", "Nº do microchip"];
T["Obrigado"] = ["Thank you", "Gracias", "Danke", "Merci", "Obrigado"];
T["Outro ficheiro"] = ["Another file", "Otro archivo", "Andere Datei", "Autre fichier", "Outro arquivo"];
T["PDF, imagem..."] = ["PDF, image...", "PDF, imagen...", "PDF, Bild...", "PDF, image...", "PDF, imagem..."];
T["Parceiros"] = ["Partners", "Socios", "Partner", "Partenaires", "Parceiros"];
T["Partilhar"] = ["Share", "Compartir", "Teilen", "Partager", "Compartilhar"];
T["Password"] = ["Password", "Contraseña", "Passwort", "Mot de passe", "Senha"];
T["Perfil"] = ["Profile", "Perfil", "Profil", "Profil", "Perfil"];
T["Perguntas frequentes"] = ["Frequently asked questions", "Preguntas frecuentes", "Häufige Fragen", "Questions fréquentes", "Perguntas frequentes"];
T["Permissão necessária 📷"] = ["Permission needed 📷", "Permiso necesario 📷", "Berechtigung nötig 📷", "Autorisation requise 📷", "Permissão necessária 📷"];
T["Peso"] = ["Weight", "Peso", "Gewicht", "Poids", "Peso"];
T["Peso atual"] = ["Current weight", "Peso actual", "Aktuelles Gewicht", "Poids actuel", "Peso atual"];
T["Pesquisar petshops..."] = ["Search pet shops...", "Buscar tiendas de mascotas...", "Tierläden suchen...", "Rechercher des animaleries...", "Pesquisar petshops..."];
T["Pesquisar produto..."] = ["Search product...", "Buscar producto...", "Produkt suchen...", "Rechercher un produit...", "Pesquisar produto..."];
T["Pesquisar tosquiadores..."] = ["Search groomers...", "Buscar peluqueros caninos...", "Hundefriseure suchen...", "Rechercher des toiletteurs...", "Pesquisar tosadores..."];
T["Pesquisar treinadores..."] = ["Search trainers...", "Buscar adiestradores...", "Trainer suchen...", "Rechercher des éducateurs...", "Pesquisar adestradores..."];
T["Petshops"] = ["Pet shops", "Tiendas de mascotas", "Tierläden", "Animaleries", "Petshops"];
T["Planos PetsLife"] = ["PetsLife plans", "Planes PetsLife", "PetsLife-Tarife", "Formules PetsLife", "Planos PetsLife"];
T["Precisamos de acesso à câmara para tirar uma foto."] = ["We need camera access to take a photo.", "Necesitamos acceso a la cámara para hacer una foto.", "Wir brauchen Kamerazugriff, um ein Foto zu machen.", "Nous avons besoin d'accéder à l'appareil photo.", "Precisamos de acesso à câmera para tirar uma foto."];
T["Precisamos de acesso à galeria para escolher uma foto."] = ["We need gallery access to choose a photo.", "Necesitamos acceso a la galería para elegir una foto.", "Wir brauchen Zugriff auf die Galerie, um ein Foto zu wählen.", "Nous avons besoin d'accéder à la galerie.", "Precisamos de acesso à galeria para escolher uma foto."];
T["Primeiros Socorros 🩺"] = ["First Aid 🩺", "Primeros auxilios 🩺", "Erste Hilfe 🩺", "Premiers secours 🩺", "Primeiros socorros 🩺"];
T["Produto *"] = ["Product *", "Producto *", "Produkt *", "Produit *", "Produto *"];
T["Publicar"] = ["Post", "Publicar", "Veröffentlichen", "Publier", "Publicar"];
T["Qual é o motivo?"] = ["What's the reason?", "¿Cuál es el motivo?", "Was ist der Grund?", "Quel est le motif ?", "Qual é o motivo?"];
T["Receitas"] = ["Prescriptions", "Recetas", "Rezepte", "Ordonnances", "Receitas"];
T["Recuperar password"] = ["Reset password", "Recuperar contraseña", "Passwort zurücksetzen", "Réinitialiser le mot de passe", "Recuperar senha"];
T["Registar Peso"] = ["Add Weight", "Registrar peso", "Gewicht eintragen", "Ajouter un poids", "Registrar peso"];
T["Registe sintomas, comportamentos e mais"] = ["Record symptoms, behaviour and more", "Registre síntomas, comportamientos y más", "Symptome, Verhalten und mehr erfassen", "Notez symptômes, comportements et plus", "Registre sintomas, comportamentos e mais"];
T["Remover"] = ["Remove", "Quitar", "Entfernen", "Retirer", "Remover"];
T["Remover imagem"] = ["Remove image", "Quitar imagen", "Bild entfernen", "Retirer l'image", "Remover imagem"];
T["Renovar"] = ["Renew", "Renovar", "Verlängern", "Renouveler", "Renovar"];
T["Resgates recentes"] = ["Recent redemptions", "Canjes recientes", "Aktuelle Einlösungen", "Utilisations récentes", "Resgates recentes"];
T["Sem consultas"] = ["No appointments", "Sin consultas", "Keine Termine", "Aucun rendez-vous", "Sem consultas"];
T["Sem documentos"] = ["No documents", "Sin documentos", "Keine Dokumente", "Aucun document", "Sem documentos"];
T["Sem lembretes"] = ["No reminders", "Sin recordatorios", "Keine Erinnerungen", "Aucun rappel", "Sem lembretes"];
T["Sem permissão"] = ["No permission", "Sin permiso", "Keine Berechtigung", "Pas d'autorisation", "Sem permissão"];
T["Sem petshops encontradas"] = ["No pet shops found", "No se han encontrado tiendas", "Keine Tierläden gefunden", "Aucune animalerie trouvée", "Sem petshops encontradas"];
T["Sem receitas"] = ["No prescriptions", "Sin recetas", "Keine Rezepte", "Aucune ordonnance", "Sem receitas"];
T["Sem registos"] = ["No records", "Sin registros", "Keine Einträge", "Aucun enregistrement", "Sem registros"];
T["Sem vacinas ainda"] = ["No vaccines yet", "Todavía sin vacunas", "Noch keine Impfungen", "Pas encore de vaccins", "Sem vacinas ainda"];
T["Sexo"] = ["Sex", "Sexo", "Geschlecht", "Sexe", "Sexo"];
T["Só o autor do conteúdo ou a administração podem apagar."] = ["Only the author or the admin team can delete it.", "Solo el autor del contenido o la administración pueden eliminarlo.", "Nur die Autorin bzw. der Autor oder die Administration können löschen.", "Seul l'auteur du contenu ou l'administration peut le supprimer.", "Só o autor do conteúdo ou a administração podem apagar."];
T["Telefone"] = ["Phone", "Teléfono", "Telefon", "Téléphone", "Telefone"];
T["Tentar"] = ["Try", "Intentar", "Versuchen", "Essayer", "Tentar"];
T["Tentar continuar"] = ["Try to continue", "Intentar continuar", "Weiter versuchen", "Essayer de continuer", "Tentar continuar"];
T["Tentar outra vez"] = ["Try again", "Intentar de nuevo", "Erneut versuchen", "Réessayer", "Tentar de novo"];
T["Testar videochamada agora"] = ["Test video call now", "Probar la videollamada ahora", "Videoanruf jetzt testen", "Tester la visioconférence", "Testar videochamada agora"];
T["Tipo"] = ["Type", "Tipo", "Art", "Type", "Tipo"];
T["Tipo *"] = ["Type *", "Tipo *", "Art *", "Type *", "Tipo *"];
T["Tosquiadores"] = ["Groomers", "Peluqueros caninos", "Hundefriseure", "Toiletteurs", "Tosadores"];
T["Treino & Adestramento"] = ["Training", "Adiestramiento", "Training", "Éducation", "Treino & Adestramento"];
T["Treino & Comportamento 🎯"] = ["Training & Behaviour 🎯", "Adiestramiento y conducta 🎯", "Training & Verhalten 🎯", "Éducation et comportement 🎯", "Treino & Comportamento 🎯"];
T["Trocar ficheiro"] = ["Change file", "Cambiar archivo", "Datei ändern", "Changer de fichier", "Trocar arquivo"];
T["Usar esta foto?"] = ["Use this photo?", "¿Usar esta foto?", "Dieses Foto verwenden?", "Utiliser cette photo ?", "Usar esta foto?"];
T["Utilizador"] = ["User", "Usuario", "Nutzer", "Utilisateur", "Usuário"];
T["Vacinas"] = ["Vaccines", "Vacunas", "Impfungen", "Vaccins", "Vacinas"];
T["Ver planos"] = ["See plans", "Ver planes", "Tarife ansehen", "Voir les formules", "Ver planos"];
T["Ver planos e renovar"] = ["See plans and renew", "Ver planes y renovar", "Tarife ansehen und verlängern", "Voir les formules et renouveler", "Ver planos e renovar"];
T["Vets e Outros"] = ["Vets & More", "Veterinarios y más", "Tierärzte & mehr", "Vétos et plus", "Vets e outros"];
T["Voltar"] = ["Back", "Volver", "Zurück", "Retour", "Voltar"];
T["Voltar ao login"] = ["Back to sign in", "Volver al inicio de sesión", "Zurück zur Anmeldung", "Retour à la connexion", "Voltar ao login"];
T["Website"] = ["Website", "Sitio web", "Webseite", "Site web", "Site"];
T["● Online"] = ["● Online", "● En línea", "● Online", "● En ligne", "● Online"];
T["⚖️ Registar Peso"] = ["⚖️ Add Weight", "⚖️ Registrar peso", "⚖️ Gewicht eintragen", "⚖️ Ajouter un poids", "⚖️ Registrar peso"];
T["✅ Consulta agendada!"] = ["✅ Appointment booked!", "✅ ¡Consulta reservada!", "✅ Termin gebucht!", "✅ Rendez-vous confirmé !", "✅ Consulta agendada!"];
T["✨ Personalidade"] = ["✨ Personality", "✨ Personalidad", "✨ Wesen", "✨ Caractère", "✨ Personalidade"];
T["🎉 Encontrados"] = ["🎉 Found", "🎉 Encontrados", "🎉 Gefunden", "🎉 Retrouvés", "🎉 Encontrados"];
T["💡 Dica Importante"] = ["💡 Important tip", "💡 Consejo importante", "💡 Wichtiger Tipp", "💡 Conseil important", "💡 Dica importante"];
T["📅 Marcar Consulta"] = ["📅 Book Appointment", "📅 Pedir cita", "📅 Termin buchen", "📅 Prendre rendez-vous", "📅 Marcar consulta"];
T["📋 Passos"] = ["📋 Steps", "📋 Pasos", "📋 Schritte", "📋 Étapes", "📋 Passos"];
T["📎 Comprovativo"] = ["📎 Proof", "📎 Comprobante", "📎 Nachweis", "📎 Justificatif", "📎 Comprovante"];
T["😢 Perdidos"] = ["😢 Lost", "😢 Perdidos", "😢 Vermisst", "😢 Perdus", "😢 Perdidos"];
T["🛁 Cuidados"] = ["🛁 Care", "🛁 Cuidados", "🛁 Pflege", "🛁 Soins", "🛁 Cuidados"];
T["Início"] = ["Home", "Inicio", "Start", "Accueil", "Início"];
T["Guardar Foto"] = ["Save Photo", "Guardar foto", "Foto speichern", "Enregistrer la photo", "Salvar foto"];
T["Erro"] = ["Error", "Error", "Fehler", "Erreur", "Erro"];
T["Sucesso"] = ["Success", "Correcto", "Erfolg", "Succès", "Sucesso"];
T["Sim"] = ["Yes", "Sí", "Ja", "Oui", "Sim"];
T["OK"] = ["OK", "OK", "OK", "OK", "OK"];
