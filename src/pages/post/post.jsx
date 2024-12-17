import './post.css';

function Post() {
  return (
    <>
      <div className="box">
        <body className="parent-element">
          <div className="comment_space">
            <div className="flex_row-container">
              <img
                className="userimg"
                src="src\assets\demo_image.jpg"
                alt="Name"
                width="50px"
              />
              <div className="flex_col-container">
                <div className="userName">userName</div>
                <div className="postTime">hh:mm dd/mm/yyyy</div>
              </div>
            </div>

            <div>
              <div className="problemSolving">Problem solving</div>
              <div className="caption">caption_from_DataBase</div>
            </div>

            <div className="invisible-scrollbar" id="container">
              <div>
                <p className="userName" style={{ marginLeft: '0px' }}>
                  User1
                </p>
                <p className="comment">
                  Tôi thích những dòng code này, help what??
                </p>
              </div>
              <div>
                <p className="userName" style={{ marginLeft: '0px' }}>
                  User2
                </p>
                <p className="comment">Code này quá tệ</p>
              </div>
              <div>
                <p className="userName" style={{ marginLeft: '0px' }}>
                  User3
                </p>
                <p className="comment">Tôi sẽ copy code về dùng</p>
              </div>
              <div>
                <p className="userName" style={{ marginLeft: '0px' }}>
                  User4
                </p>
                <p className="comment">Tự bơi đi bro</p>
              </div>
              <div>
                <p className="userName" style={{ marginLeft: '0px' }}>
                  User5
                </p>
                <p className="comment">
                  Demo_text_comment Demo_text_comment Demo_text_comment
                </p>
              </div>
            </div>

            <div className="flex_row-container">
              <input className="comment_box" type="text"></input>
              <button style={{ marginLeft: '10px', marginTop: '20px' }}>
                <img src="src\assets\Arrow 1.png" alt="send"></img>
              </button>
            </div>
          </div>

          <div className="code_space"></div>
        </body>
      </div>
    </>
  );
}

export default Post;
