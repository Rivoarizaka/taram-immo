"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function Home() {
  const [properties, setProperties] = useState<any[]>([]);
  const [session, setSession] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const initializeData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);

      if (session) {
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single();

        if (profile) setRole(profile.role);
      }

      const { data } = await supabase.from("properties").select("*");
      if (data) setProperties(data);
    };

    initializeData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <nav className="flex justify-between items-center mb-8 bg-white dark:bg-slate-800 p-4 rounded shadow-sm border border-gray-200 dark:border-slate-700">
        <h1 className="text-xl font-bold text-blue-600">Taram Immo</h1>

        <div className="flex items-center gap-6">
          {session ? (
            <>
              <span className="text-sm">
                Bonjour, <span className="font-bold capitalize">{session.user.email?.split("@")[0]}</span>
                <span className="ml-1 text-xs text-gray-500">({role})</span>
              </span>

              {/* AFFICHAGE CONDITIONNEL : Uniquement si c'est un agent */}
              {role === "agent" && (
                <Link href="/dashboard" className="text-blue-600 hover:underline text-sm font-medium">
                  Mon Dashboard
                </Link>
              )}

              <button onClick={handleLogout} className="text-red-600 hover:underline text-sm">
                Déconnexion
              </button>
            </>
          ) : (
            <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded text-sm">
              Se connecter
            </Link>
          )}
        </div>
      </nav>

      {session ? (
        <>
          <h2 className="text-2xl font-semibold mb-6">Biens disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {properties.map((prop) => (
              <div key={prop.id} className="border p-4 rounded shadow-sm">
                <h3 className="font-bold text-lg">{prop.title}</h3>
                <p className="text-gray-600">{prop.city}</p>
                <p className="text-blue-600 font-bold mt-2">{prop.price.toLocaleString()} €</p>
                <p className="text-sm mt-2 text-gray-500">{prop.description}</p>
              </div>
            ))}
            {properties.length === 0 && <p>Aucun bien publié pour le moment.</p>}
          </div>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-semibold mb-6">Bienvenue sur la plateforme Immobilière</h2>
          <p>Veuillez vous connecter pour consulter les biens disponibles</p>
        </>
      )}
    </div>
  );
}
