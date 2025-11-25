export default function NotificationPrompt() {
	return <div id="notificationPrompt">
		<h2>Restez au courant !</h2>
		<p>
			Votre navigateur permet l'envoi de notifications.<br />
			Si vous les autorisez, Scan Conso peut vérifier si un rappel a eu lieu sur l'un de vos produits récemment.<br />
			Cette notification apparaît si un rappel a été trouvé, et la vérification est effectuée toutes les 12 heures.<br />
			Vous pouvez aussi retirer ce message en les refusant.
		</p>
		<button type="button" onClick={() => Notification?.requestPermission().then(() => location.reload(), console.warn)}>Autoriser ou refuser les notifications</button>
	</div>
};