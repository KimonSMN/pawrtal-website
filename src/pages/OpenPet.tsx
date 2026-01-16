import { ArrowLeft, MapPin, Calendar, User, Mail } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import dog_image from "../assets/dog_1.jpg";

export default function OpenPet() {
    const navigate = useNavigate();
    const { id } = useParams();

    // temporary mock
    const pet = {
        name: "Pyke",
        breed: "Shiba inu",
        description:
            "Φιλικό shiba inu με κόκκινο κολάρο. Ακούει στο Πάικ. Εξαφανίστηκε κοντά στο πάρκο Χολαργού. Παρακαλώ επικοινωνήστε αν τον δείτε!",
        location: "Χολαργός, Αθήνα",
        date: "05/03/2025",
        ownerName: "Κίμωνας Σμυρλιάνος",
        ownerEmail: "kimonsmirlianos@gmail.com",
        imageUrl: dog_image,
    };

    return (
        <div className="mx-auto max-w-6xl px-6 py-10">
            {/* Back */}
            <button
                onClick={() => navigate(-1)}
                className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 cursor-pointer"
            >
                <ArrowLeft size={16} />
            </button>

            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                <div className="overflow-hidden rounded-2xl bg-zinc-200 h-[450px]">
                    <img src={pet.imageUrl} alt={pet.name} className="h-full w-full object-cover" />
                </div>

                <div className="flex flex-col gap-6">
                    <div>
                        <h1 className="text-3xl font-semibold">{pet.name}</h1>
                        <p className="text-zinc-500">{pet.breed}</p>
                    </div>

                    <div>
                        <h3 className="mb-2 font-medium">Περιγραφή</h3>
                        <p className="text-sm text-zinc-600">{pet.description}</p>
                    </div>

                    <div className="space-y-2 text-sm text-zinc-600">
                        <div className="flex items-center gap-2">
                            <MapPin size={16} />
                            {pet.location}
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            Εξαφάνιση: {pet.date}
                        </div>
                    </div>

                    <hr />

                    <div>
                        <h3 className="mb-3 font-medium">Επικοινωνήστε με τον ιδιοκτήτη</h3>
                        <div className="space-y-2 text-sm text-zinc-600">
                            <div className="flex items-center gap-2">
                                <User size={16} />
                                {pet.ownerName}
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail size={16} />
                                {pet.ownerEmail}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate(`/pets/${id}/found`)}
                        className="mt-4 w-full rounded-lg bg-zinc-800 py-3 text-sm font-medium text-white hover:bg-zinc-700 transition cursor-pointer"
                    >
                        Βρήκα αυτό το κατοικίδιο
                    </button>
                </div>
            </div>
        </div>
    );
}
