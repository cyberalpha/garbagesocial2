
import { Post, User } from "../types";

export const mockUsers: User[] = [
  {
    id: "user1",
    name: "Juan Pérez",
    email: "juan@example.com",
    avatar: "https://i.pravatar.cc/150?img=1",
    type: "individual",
    rating: {
      positive: 15,
      negative: 2,
      neutral: 3
    }
  },
  {
    id: "user2",
    name: "María García",
    email: "maria@example.com",
    avatar: "https://i.pravatar.cc/150?img=5",
    type: "individual",
    rating: {
      positive: 8,
      negative: 1,
      neutral: 2
    }
  },
  {
    id: "org1",
    name: "EcoReciclaje S.A.",
    email: "contact@ecoreciclaje.com",
    avatar: "https://i.pravatar.cc/150?img=12",
    type: "organization",
    rating: {
      positive: 42,
      negative: 3,
      neutral: 5
    }
  }
];

export const mockPosts: Post[] = [
  {
    id: "post1",
    userId: "user1",
    username: "Juan Pérez",
    userAvatar: "https://i.pravatar.cc/150?img=1",
    category: "organic",
    title: "Restos de poda de jardín",
    description: "Tengo restos de poda de mi jardín que pueden servir como leña o compost.",
    imageUrl: "https://images.unsplash.com/photo-1626080308314-d7868884cfe9",
    location: {
      lat: -34.603722,
      lng: -58.381592,
      address: "Av. Corrientes 1234, Buenos Aires"
    },
    createdAt: "2023-06-15T14:30:00Z",
    status: "available"
  },
  {
    id: "post2",
    userId: "user2",
    username: "María García",
    userAvatar: "https://i.pravatar.cc/150?img=5",
    category: "paper",
    title: "Cajas de cartón y periódicos",
    description: "Tengo varias cajas de cartón y periódicos viejos para reciclar.",
    imageUrl: "https://images.unsplash.com/photo-1589634749000-1e72e2078efd",
    location: {
      lat: -34.608333,
      lng: -58.373333,
      address: "Av. 9 de Julio 1000, Buenos Aires"
    },
    createdAt: "2023-06-16T10:15:00Z",
    status: "claimed",
    claimedBy: "org1",
    claimedAt: "2023-06-16T11:30:00Z"
  },
  {
    id: "post3",
    userId: "org1",
    username: "EcoReciclaje S.A.",
    userAvatar: "https://i.pravatar.cc/150?img=12",
    category: "plastic",
    title: "Botellas plásticas industriales",
    description: "Disponemos de 50 kg de botellas de plástico industrial limpias para reciclaje.",
    imageUrl: "https://images.unsplash.com/photo-1605600659453-719f4b7ee6af",
    location: {
      lat: -34.615833,
      lng: -58.385833,
      address: "Av. San Juan 2500, Buenos Aires"
    },
    createdAt: "2023-06-14T09:45:00Z",
    status: "collected",
    claimedBy: "user2",
    claimedAt: "2023-06-14T10:30:00Z",
    rating: {
      publisher: "positive",
      collector: "positive"
    }
  },
  {
    id: "post4",
    userId: "user1",
    username: "Juan Pérez",
    userAvatar: "https://i.pravatar.cc/150?img=1",
    category: "glass",
    title: "Botellas de vidrio",
    description: "Colección de botellas de vidrio de varios colores, limpias y sin etiquetas.",
    imageUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18",
    location: {
      lat: -34.600000,
      lng: -58.380000,
      address: "Av. Córdoba 2100, Buenos Aires"
    },
    createdAt: "2023-06-13T16:20:00Z",
    status: "available"
  },
  {
    id: "post5",
    userId: "user2",
    username: "María García",
    userAvatar: "https://i.pravatar.cc/150?img=5",
    category: "metal",
    title: "Latas de aluminio",
    description: "Tengo una bolsa grande de latas de aluminio limpias para reciclar.",
    imageUrl: "https://images.unsplash.com/photo-1532634922-8fe0b757fb13",
    location: {
      lat: -34.605000,
      lng: -58.375000,
      address: "Av. de Mayo 800, Buenos Aires"
    },
    createdAt: "2023-06-12T13:10:00Z",
    status: "collected",
    claimedBy: "user1",
    claimedAt: "2023-06-12T14:15:00Z",
    rating: {
      publisher: "neutral",
      collector: "positive"
    }
  },
  {
    id: "post6",
    userId: "org1",
    username: "EcoReciclaje S.A.",
    userAvatar: "https://i.pravatar.cc/150?img=12",
    category: "dump",
    title: "Denuncia de basural ilegal",
    description: "Hemos detectado un basural ilegal en esta ubicación que requiere atención urgente.",
    imageUrl: "https://images.unsplash.com/photo-1596123068611-c89d5b63d911",
    location: {
      lat: -34.620000,
      lng: -58.390000,
      address: "Calle Constitución 1500, Buenos Aires"
    },
    createdAt: "2023-06-11T08:30:00Z",
    status: "claimed",
    claimedBy: "org1",
    claimedAt: "2023-06-11T09:45:00Z"
  }
];
