import { Interest } from "../types/interest";

const PHOTO = "/images/dummy_profile.png";

export const dummyInterests: Interest[] = [
  // Sent
  {
    id: "I-001",
    profileName: "Kavitha Ramesh",
    profilePhoto: PHOTO,
    date: "01 April 2026",
    status: "sent_reminder",
    isReminderDue: true,
  },
  {
    id: "I-002",
    profileName: "Priya Suresh",
    profilePhoto: PHOTO,
    date: "04 April 2026",
    status: "sent_interest",
  },
  {
    id: "I-003",
    profileName: "Anitha Krishnan",
    profilePhoto: PHOTO,
    date: "04 April 2026",
    status: "sent_interest",
  },

  // Received
  {
    id: "I-004",
    profileName: "Meena Selvam",
    profilePhoto: PHOTO,
    date: "04 April 2026",
    status: "received_reminder",
    isNew: true,
  },
  {
    id: "I-005",
    profileName: "Saranya Balasubramanian",
    profilePhoto: PHOTO,
    date: "04 April 2026",
    status: "received_interest",
    isNew: true,
  },
  {
    id: "I-006",
    profileName: "Lakshmi Venkatesh",
    profilePhoto: PHOTO,
    date: "04 April 2026",
    status: "received_interest",
    isNew: true,
  },
  {
    id: "I-007",
    profileName: "Nithya Chandrasekaran",
    profilePhoto: PHOTO,
    date: "01 April 2026",
    status: "received_interest",
  },
  {
    id: "I-008",
    profileName: "Dharani Subramanian",
    profilePhoto: PHOTO,
    date: "01 April 2026",
    status: "received_interest",
  },

  // Accepted
  {
    id: "I-009",
    profileName: "Pavithra Natarajan",
    profilePhoto: PHOTO,
    myPhoto: PHOTO,
    date: "04 April 2026",
    status: "accepted_by_me",
  },
  {
    id: "I-010",
    profileName: "Sowmiya Periyasamy",
    profilePhoto: PHOTO,
    myPhoto: PHOTO,
    date: "04 April 2026",
    status: "accepted_by_them",
  },
  {
    id: "I-011",
    profileName: "Janani Ramalingam",
    profilePhoto: PHOTO,
    myPhoto: PHOTO,
    date: "04 April 2026",
    status: "accepted_by_them",
  },
  {
    id: "I-012",
    profileName: "Revathi Arunachalam",
    profilePhoto: PHOTO,
    myPhoto: PHOTO,
    date: "01 April 2026",
    status: "accepted_by_me",
  },
  {
    id: "I-013",
    profileName: "Vinitha Krishnamurthy",
    profilePhoto: PHOTO,
    myPhoto: PHOTO,
    date: "01 April 2026",
    status: "accepted_by_me",
  },

  // Declined
  {
    id: "I-014",
    profileName: "Abinaya Shanmugam",
    profilePhoto: PHOTO,
    date: "08 April 2026",
    status: "declined_by_me",
  },
  {
    id: "I-015",
    profileName: "Kalaivani Muthusamy",
    profilePhoto: PHOTO,
    date: "08 April 2026",
    status: "skipped_by_them",
    isNew: true,
  },
  {
    id: "I-016",
    profileName: "Hemamalini Rajendran",
    profilePhoto: PHOTO,
    date: "08 April 2026",
    status: "skipped_by_them",
    isNew: true,
  },
  {
    id: "I-017",
    profileName: "Thenmozhi Palaniswamy",
    profilePhoto: PHOTO,
    date: "09 April 2026",
    status: "declined_by_me",
  },
  {
    id: "I-018",
    profileName: "Bharathi Annamalai",
    profilePhoto: PHOTO,
    date: "09 April 2026",
    status: "declined_by_me",
  },
];
