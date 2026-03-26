export default function OfflinePage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Ei verkkoyhteyttä</h1>
        <p className="text-muted-foreground">
          Tämä sivu ei ole saatavilla offline-tilassa. Avaa sovellus uudelleen
          kun olet verkossa, niin sisältö tallentuu laitteellesi.
        </p>
      </div>
    </div>
  );
}
