$(document).ready(function() {
    var bodyInput = $("#body");
    var titleInput = $("#title");
    var cmsForm = $("#cms");
    var authorSelect = $("#author");
    $(cmsForm).on("submit", handleFormSubmit);
    var url = window.location.search;
    var postId;
    var authorId;
    var updating = false;
  
    if (url.indexOf("?post_id=") !== -1) {
      postId = url.split("=")[1];
      getPostData(postId, "post");
    }
    else if (url.indexOf("?author_id=") !== -1) {
      authorId = url.split("=")[1];
    }
  
    getAuthors();
  
    // function for handling what happens when the form to create a new post is submitted
    function handleFormSubmit(event) {
      event.preventDefault();
      if (!titleInput.val().trim() || !bodyInput.val().trim() || !authorSelect.val()) {
        return;
      }
      var newPost = {
        title: titleInput
          .val()
          .trim(),
        body: bodyInput
          .val()
          .trim(),
        AuthorId: authorSelect.val()
      };

      if (updating) {
        newPost.id = postId;
        updatePost(newPost);
      }
      else {
        submitPost(newPost);
      }
    }
  
    // Submits a new post and brings user to blog page upon completion
    function submitPost(post) {
      $.post("/api/posts", post, function() {
        window.location.href = "/blog";
      });
    }
  
    // Gets post data for the current post if we're editing, or if we're adding to an author's existing posts
    function getPostData(id, type) {
      var queryUrl;
      switch (type) {
      case "post":
        queryUrl = "/api/posts/" + id;
        break;
      case "author":
        queryUrl = "/api/authors/" + id;
        break;
      default:
        return;
      }
      $.get(queryUrl, function(data) {
        if (data) {
          console.log(data.AuthorId || data.id);
          titleInput.val(data.title);
          bodyInput.val(data.body);
          authorId = data.AuthorId || data.id;
          updating = true;
        }
      });
    }
  
    // A function to get Authors and then render our list of Authors
    function getAuthors() {
      $.get("/api/authors", renderAuthorList);
    }
    // Function to either render a list of authors, or if there are none, direct the user to the page
    // to create an author first
    function renderAuthorList(data) {
      if (!data.length) {
        window.location.href = "/authors";
      }
      $(".hidden").removeClass("hidden");
      var rowsToAdd = [];
      for (var i = 0; i < data.length; i++) {
        rowsToAdd.push(createAuthorRow(data[i]));
      }
      authorSelect.empty();
      console.log(rowsToAdd);
      console.log(authorSelect);
      authorSelect.append(rowsToAdd);
      authorSelect.val(authorId);
    }
  
    // Creates the author options in the dropdown
    function createAuthorRow(author) {
      var listOption = $("<option>");
      listOption.attr("value", author.id);
      listOption.text(author.name);
      return listOption;
    }
  
    // Update a given post, bring user to the blog page when done
    function updatePost(post) {
      $.ajax({
        method: "PUT",
        url: "/api/posts",
        data: post
      })
        .then(function() {
          window.location.href = "/blog";
        });
    }
  });