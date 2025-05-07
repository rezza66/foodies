export const UserProfile = ({ user }) => {
  if (!user) {
    return <p className="text-center mt-4">Loading user data...</p>;
  }

  return (
    <div className="container d-flex justify-content-center mt-5">
      <div className="card shadow-lg" style={{ width: "24rem" }}>
        <div className="card-body text-center">
          <h3 className="card-title text-primary">PROFILE</h3>
          <hr />
          <div className="text-start">
            <p className="mb-2">
              <strong>Name:</strong> {user.username}
            </p>
            <p className="mb-0">
              <strong>Email:</strong> {user.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
