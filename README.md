Welcome to the 1st milestone of the Patterns Paymaster Management App! 

In order to test the frontend, firstly set up .env files in frontend and backend directories (just copy from example.env):

    cp backend/example.env backend/.env
    cp backend/example.env frontend/.env

Next run the following commands:

    docker compose build
    docker compose up

You should now be able to access the frontend on

    localhost:5173/

We have implemented SIWE authentication so you'll need a supported wallet to login :) Please note that this is just a frontend preview so the application is not functional. All data is mocked up and most buttons will not work as they require fully operational backend. 

<img width="800" alt="image" src="https://github.com/user-attachments/assets/2d03a651-0ee3-4c55-aaa7-35241591e52e" />

After clicking on "New policy", you'll be able to access the creation of a new policy:

<img width="800" alt="image" src="https://github.com/user-attachments/assets/1c50a89b-d96a-47de-ba29-4c504bfbbb81" />
