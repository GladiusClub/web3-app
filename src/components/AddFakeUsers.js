import { fakeNames, estonianSportsClubs } from "../fakeData";

const handleFakeUsers = () => {
  for (let i = 0; i < fakeNames.length; i++) {
    const name = fakeNames[i];
    const email = `fake${i}@example.com`;
    const wallet = createNewWallet();

    // Loop through each sports club and add the user to their members collection
    for (let j = 0; j < estonianSportsClubs.length; j++) {
      const club = estonianSportsClubs[j];
      setDoc(doc(db, "club", club, "members", name), {
        name: name,
        email: email,
        address: wallet.address,
        privateKey: wallet.privateKey,
        club: club,
      }).catch((error) => {
        console.error("Error adding document: ", error);
      });
    }
  }
};

<Button variant="contained" color="secondary" onClick={handleFakeUsers}>
  Create Fake Users
</Button>;
