async function apiGetUsers(numUsers = 20) {
  const response = await fetch(`https://randomuser.me/api/?results=${numUsers}`);
  const data = await response.json();

  if (response.ok) {
    const users = data.results.map((user) => ({
      name: `${user.name.first} ${user.name.last}`,
      photo: user.picture.medium,
    }));

    return users;
  }
}
