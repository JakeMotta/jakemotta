/*
 *  Team: Austin Zurbuchen, Jacob Motta, Brendan Kao, Sidney Lai, Roben Angeles
 *
 *
 *
 *  Code referenced from http://www.linuxjournal.com/content/accessing-postgresql-cc
 */
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <errno.h>
#include <sys/stat.h>
#include "/usr/include/postgresql/libpq-fe.h"

#define die(e) do { fprintf(stderr, "%s\n", e); exit(EXIT_FAILURE); } while (0);

void do_exit(PGconn *conn) {
    PQfinish(conn);
    exit(1);
}

int main(int argc, char *argv[]) {

    // --------------------------------- CREATE VARIABLES ----------------------------------------------

    char username[100], video_name[1000], myVar[1000], current_image[1000], video_ID[100], video_url[1280], video_path[1280], table_name[100], new_table[1000], line[2000], master_buffer[10000], next_command[2000];
    int i, j, temp, varlen, varlen2, link[2], n, process_status, child_pid, child_pid_2, bytes_read, total_bytes_read;
    int width, height, numframes, fps, id;
    pid_t wpid;

    // --------------------------------- BEGIN CONNECTION TO DATABASE ----------------------------------------------

        PGconn          *conn;
        PGresult        *res;  
        int             rec_count;
        int             row;
        int             col;
        

        conn = PQconnectdb("dbname=cs160 host=127.0.0.1 user=postgres password=student");
        

        if (PQstatus(conn) == CONNECTION_BAD) {
            puts("We were unable to connect to the database");
            exit(0);
        }
        else
            printf("Connected to database!\n"); 

        
        // --------------------------------- VARIABLE ASSIGNMENT/CREATION ----------------------------------------------

        // Get variable data from PHP video upload, passed through main's parameters

        strcpy(&video_name[0], argv[1]);                            // Video name
        strcpy(&username[0], argv[2]);                              // Username

        varlen = strlen(username);                                  // Get length of username
        strcpy(&video_url[0], "videos/");                           // Prefix "videos/" to video url
        strcpy(&video_url[7], &username[0]);                        // Append username to string
        strcpy(&video_url[varlen + 7], "/");                        // Append "/"
        strcpy(&video_url[varlen + 8], &video_name[0]);             // Append sub-directory (video name)
        varlen2 = strlen(video_name);                               // Get length of videoname
        strcpy(&video_url[varlen + 8 + varlen2], "/");              // Append "/"

        strcpy(&video_path[0], &video_url[0]);                      // Get video path without video name
        strcpy(&video_url[varlen + 9 + varlen2], &video_name[0]);   // Append videoname
                                                                    // Final string: videos/username/videoname/videoname
        // DEFINE TABLE TO WRITE TO
        strcpy(&table_name[0], &username[0]);
        printf("%s", &video_path);
        // ----------- FFMPEG STUFF (sends console commands for FFMPEG, stores data to array, parses array, assigns to variables) ---------------

        memset(&master_buffer[0], 0, sizeof(master_buffer));

        //pipe failure
        if (pipe(link) == -1)
            die("pipe");

        switch (child_pid = fork()) {
            case -1:    //fork failure
                printf ("fork() error\n");
                exit (EXIT_FAILURE);

            case 0:     // child
                dup2 (link[1], 1); // 0 is stdin (read), 1 is stdout (write)
                dup2 (STDOUT_FILENO, STDERR_FILENO); //redirect std err to stdout
                close(link[0]);

                //get video width/height/frames
                execl("/usr/bin/ffprobe", "ffprobe", "-v", "error", "-of", "flat=s=_", "-count_frames", "-select_streams", "v:0", "-show_entries", "stream=height,width,nb_read_frames,r_frame_rate", "-of", "default=nokey=1:noprint_wrappers=1", &video_url[0], (char *) NULL);
                die("execl");
                exit (EXIT_FAILURE); // should not make it here!

            default:    // parent
                close(link[1]);
                bytes_read = read(link[0], &line[0], sizeof(line) - 1);
                
                while (bytes_read > 0) {
                    line[bytes_read] = '\0';
                    total_bytes_read = total_bytes_read + bytes_read;

                    if( total_bytes_read < (sizeof(master_buffer) - 1))
                        strcat (master_buffer, line);
                    else
                        printf("Exceeded master buffer size!\n");
                    bytes_read = read(link[0], line, sizeof(line) - 1);
                }

                char *p = strtok (line, "\n");
                char *output[1000];
                i = 0;

                // parse console output to an array called "output"
                while(p != NULL) {
                    output[i++] = p;
                    p = strtok (NULL, "\n");
                }

                // save value of 'i' to temp
                temp = i;

                /**
                    -ATOI converts the string (output from console) to an integer
                    -Sets variables to console output
                **/
                width = atoi(output[0]);
                height = atoi(output[1]);
                fps = atoi(output[2]); 
                numframes = atoi(output[3]); 
                
                break;
        }


        // --------------------------------- INSERTS NEW VIDEO DATA TO USER'S TABLE ----------------------------------------------

        // id | name | width | height | numframes | fps | username | url 
            
        //creates a string with a vairable inside, so we're able to dynamically send our data
        snprintf(next_command, 2000, "INSERT INTO %s(name, width, height, numframes, fps, username, url) VALUES ('%s', '%d', '%d', '%d', '%d', '%s', '%s')", &table_name[0], &video_name[0], width, height, numframes, fps, &username[0], &video_url[0]);

        //executes the command to postgres
        res = PQexec(conn, &next_command[0]);
           
        if (PQresultStatus(res) != PGRES_COMMAND_OK) 
            do_exit(conn);     
        
        PQclear(res); 


        // --------------------------------- SELECTS PROPER VIDEO TO CREATE FRAME-BY-FRAME TABLE FOR ----------------------------------------------

        snprintf(next_command, 2000, "select id from %s order by id", &table_name[0]);

        res = PQexec(conn, &next_command[0]);
        
        if (PQresultStatus(res) != PGRES_TUPLES_OK) 
            puts("We did not get any data!");
        
        rec_count = PQntuples(res);
 
        // Grabs the last record, which will be the latest video input
        for (row=0; row < rec_count; row++) {
            if(row == rec_count-1) 
                strcpy(&video_ID[0], PQgetvalue(res, row, 0));   
        }

        PQclear(res);    


        // ----------------------------------- CREATE TABLE FOR SPECIFIC VIDEO UPLOADED (to save frames to) -------------------------------------

        strcpy(&new_table[0], &username[0]);                // Begin with Username
        strcpy(&new_table[varlen], "_");                    // Append "_"
        strcpy(&new_table[varlen + 1], &video_ID[0]);       // Append video ID
        
        // Create table for specific video
        snprintf(next_command, 2000, "CREATE TABLE %s (ID INT NOT NULL, name TEXT NOT NULL, frame INT NOT NULL, username TEXT NOT NULL)", &new_table[0]);

        //executes the command to postgres
        res = PQexec(conn, &next_command[0]);
           
        if (PQresultStatus(res) != PGRES_COMMAND_OK) 
            do_exit(conn);     

        PQclear(res);               

        
        // --------------------------------- INSERTS DATA FOR EACH VIDEO FRAME ----------------------------------------------

        id = atoi(video_ID);
        //printf("id: %d\n", id);

        //creates a string with a vairable inside, so we're able to dynamically send our data

        for(i = 1; i <= numframes; i++) {
            snprintf(next_command, 2000, "INSERT INTO %s(ID, name, frame, username) VALUES ('%d', '%s', '%d', '%s')", &new_table[0], id, &video_name[0], i, &username[0]);
            res = PQexec(conn, &next_command[0]);
               
            if (PQresultStatus(res) != PGRES_COMMAND_OK) 
                do_exit(conn); 
        }    
        
        PQclear(res);      


        // --------------------------------- PULL VIDEO APART USING FFMPEG ----------------------------------------------
        
        switch (child_pid_2 = fork()) {
            case -1:    //fork failure
                printf ("fork() error\n");
                exit (EXIT_FAILURE);

            case 0:     // child
                // Rip the video into individual frames
                strcpy(&myVar[0], "%d");
                snprintf(next_command, 2000, "ffmpeg -i %s -vf fps=%d %s%d.%s.png", &video_url[0], fps, &video_path[0], id, &myVar[0]);
                system(&next_command[0]);
                die("execl");
                exit (EXIT_FAILURE); // should not make it here!
                break;

            default:    // parent
                printf("default!\n");
                break;
        }

        // --------------------------------- CHANGE PERMISSIONS TO READ/WRITE ON EACH STILL-IMAGE ----------------------------------------------
                
                //snprintf(next_command, 2000, "sudo -S <<< student chmod -R 777 %s", &video_path[0]);
                //printf("%s", &video_path[0]);
                // system("cd /var/www/html");
                // system("echo student | sudo -S -chmod -R 777 videos/");


        // --------------------------------- END CONNECTION TO DATABASE ----------------------------------------------

        PQfinish(conn);
     
        return 0;
}