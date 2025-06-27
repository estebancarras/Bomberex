import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";

// Configuración Firebase (ajustar con la configuración real del proyecto)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

async function insertMantenimientos() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // Obtener vehículos
  const vehiculosSnapshot = await getDocs(collection(db, "vehiculos"));
  const vehiculos = vehiculosSnapshot.docs.map(doc => {
    const data = doc.data() as any;
    return { id: doc.id, ...data };
  });

  if (vehiculos.length === 0) {
    console.log("No hay vehículos en la base de datos.");
    return;
  }

  const tipos = ["Preventivo", "Correctivo", "Inspección"];
  const estados = ["Pendiente", "En progreso", "Completado"];
  const prioridades = ["baja", "media", "alta"];
  const talleres = ["Taller Central", "Taller Norte", "Taller Sur"];

  let mantenimientoCount = 0;

  for (const vehiculo of vehiculos) {
    // Generar entre 2 y 4 mantenimientos por vehículo
    const numMantenimientos = Math.floor(Math.random() * 3) + 2;

    for (let i = 0; i < numMantenimientos; i++) {
      const mantenimiento = {
        tipo: tipos[Math.floor(Math.random() * tipos.length)],
        descripcion: `Mantenimiento de tipo ${tipos[i % tipos.length]} para vehículo ${vehiculo.vehiculo || vehiculo.nombre || vehiculo.id}`,
        fecha: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
        vehiculo: vehiculo.id,
        estado: estados[Math.floor(Math.random() * estados.length)],
        completado: false,
        tiempomanteni: [new Date().toISOString()],
        categoria: tipos[Math.floor(Math.random() * tipos.length)],
        patente: vehiculo.patente || "N/A",
        prioridad: prioridades[Math.floor(Math.random() * prioridades.length)],
        tallerResponsable: talleres[Math.floor(Math.random() * talleres.length)]
      };

      await addDoc(collection(db, "mantenimientos"), mantenimiento);
      mantenimientoCount++;

      if (mantenimientoCount >= 10) {
        console.log(`Se han insertado ${mantenimientoCount} mantenimientos.`);
        return;
      }
    }
  }

  console.log(`Se han insertado ${mantenimientoCount} mantenimientos.`);
}

insertMantenimientos().catch(console.error);
