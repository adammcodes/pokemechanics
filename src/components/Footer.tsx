export default function Footer() {
  return (
    <footer>
      {/* {versionGroup.isLoading && null}
      {versionGroup.data && ( */}
      <>
        POKEMON AND ALL RESPECTIVE NAMES ARE TRADEMARK AND © OF NINTENDO
        1996-2023
      </>
      <style jsx>
        {`
          footer {
            width: 100%;
            height: 100px;
            border-top: 1px solid #eaeaea;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          footer img {
            margin-left: 0.5rem;
          }
          footer a {
            display: flex;
            justify-content: center;
            align-items: center;
            text-decoration: none;
            color: inherit;
          }
        `}
      </style>
    </footer>
  );
}
