"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  const [myProperties, setMyProperties] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchMyProperties = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      // On récupère uniquement les biens de l'agent connecté
      const { data, error } = await supabase.from("properties").select("*").eq("agent_id", session.user.id);

      if (data) setMyProperties(data);
    };

    fetchMyProperties();
  }, [router]);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/" className="text-blue-600 hover:underline">
          &larr; Retour à l'accueil
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">Tableau de bord Agent : Mes Biens</h1>

      <div className="grid grid-cols-1 gap-4">
        {myProperties.map((prop) => (
          <div key={prop.id} className="border p-4 rounded shadow-sm flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">{prop.title}</h3>
              <p className="text-gray-600">
                {prop.city} - {prop.price.toLocaleString()} €
              </p>
            </div>
            <div>
              <span
                className={`px-3 py-1 rounded text-sm ${
                  prop.is_published ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {prop.is_published ? "Publié" : "Brouillon"}
              </span>
            </div>
          </div>
        ))}
        {myProperties.length === 0 && <p>Vous n'avez aucun bien enregistré.</p>}
      </div>
    </div>
  );
}
