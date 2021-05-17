# REVIEW

## INTRO

- In the review today we will be creating a CRUD app and getting our data from [this api](https://hp-api.herokuapp.com/).

## Requirements

- We need to create the following end points

  - /home that will show all the characters.
    - Each character will have a button where we can favorite that character information and save it into our database.
    - Here are the info that we will need to store:
      - Name
      - House
      - patronus
      - is alive (true or false)
  - /favorite-character, this endpoint will favorite the characters.
    - After a character has been added, redirect the user to my favorite characters page.

  - /character/my-fav-characters, this will retrieve all the favorite characters from the API
    - There will be a link rendered to redirect the user to the details page of that character.

  - /character/character_id, this will retrieve the character from the DB so we can Edit the character info or delete it.
    - When the character info has been edited they will be redirected to the same page of the character details.
    - When deleting a character, we are going to redirect the user to the /my-characters page
  - /character/create, this will display a form where we can create a character with the following information:
    - Name
    - House
    - Patrouns
    - is alive (true of false)

  - /character/my-characters
    - Display all the created characters
    - you can also edit the information for the character or delete it here

- We need to implement either flex-box or grid when displaying the character information.
