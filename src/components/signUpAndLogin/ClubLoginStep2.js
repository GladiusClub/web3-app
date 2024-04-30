import React, { useEffect, useState, useCallback } from "react";
import { Box, Button, CircularProgress, Typography, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFirebase } from "../contexts/firebaseContext";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function ClubStep2({ clubName, calendar }) {
  const navigate = useNavigate();
  const { auth, db } = useFirebase();
  const [loading, setLoading] = useState(true);
  const [creatingClub, setCreatingClub] = useState(false);
  const [stellarWallet, setStellarWallet] = useState("");
  const [clubCreated, setClubCreated] = useState(false);
  const [subscriptionId, setSubscriptionId] = useState("");

  const fetchClubCreationAPI = useCallback(
    (uid, clubName) => {
      setCreatingClub(true); // Start loading for club creation
      fetch(
        "https://europe-west1-wallet-login-45c1c.cloudfunctions.net/SignupGladiusClub",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ClubOwnerUID: uid,
            ClubName: clubName,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Club creation response:", data);
          if (data.data.club_uid && calendar) {
            const clubDocRef = doc(db, "clubs", data.data.club_uid);
            setDoc(clubDocRef, { calendars: [calendar] }, { merge: true })
              .then(() => {
                console.log("Calendar added to club document");
                setSubscriptionId(data.data.gladius_subscriptions_id);
                setCreatingClub(false);
                setClubCreated(true);
              })
              .catch((error) => {
                console.error("Error adding calendar to club:", error);
              });
          }
        })
        .catch((error) => {
          console.error("Error creating club:", error);
          setCreatingClub(false);
        });
    },
    [db, calendar]
  );

  useEffect(() => {
    let intervalId;
    let attempts = 0;

    const checkUserDocument = () => {
      const uid = auth.currentUser?.uid;
      if (uid) {
        const docRef = doc(db, "users", uid);
        getDoc(docRef)
          .then((docSnap) => {
            if (docSnap.exists()) {
              console.log("Document found, user exists!");
              const walletId = docSnap.data().stellar_wallet;
              setStellarWallet(walletId);
              clearInterval(intervalId);
              setLoading(false);
              fetchClubCreationAPI(uid, clubName);
            } else if (attempts >= 40) {
              clearInterval(intervalId);
              setLoading(false);
              console.log("Document not found within 20 seconds.");
            }
            attempts++;
          })
          .catch((error) => {
            console.error("Failed to fetch user document:", error);
            setLoading(false);
          });
      }
    };

    intervalId = setInterval(checkUserDocument, 500);
    return () => clearInterval(intervalId);
  }, [auth, db, navigate, clubName, fetchClubCreationAPI]);

  const handleSignIn = () => {
    navigate("/clubdashboard");
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      marginBottom="1em"
      minHeight="300px"
    >
      {(loading || creatingClub) && (
        <>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>
            {creatingClub
              ? "Adding club to contract..."
              : "Creating Stellar Wallet..."}
          </Typography>
        </>
      )}
      {stellarWallet && (
        <Typography sx={{ mt: 2, mb: 2 }}>
          <Link
            href={`https://stellar.expert/explorer/testnet/account/${stellarWallet}`}
            target="_blank"
          >
            View your stellar wallet
          </Link>
        </Typography>
      )}
      {clubCreated && subscriptionId && (
        <Typography sx={{ mb: 2 }}>
          <Link
            href={`https://stellar.expert/explorer/testnet/contract/${subscriptionId}`}
            target="_blank"
          >
            View subscription contract
          </Link>
        </Typography>
      )}
      <Button
        variant="contained"
        color="secondary"
        onClick={handleSignIn}
        disabled={!clubCreated}
      >
        Enter Gladius
      </Button>
    </Box>
  );
}
