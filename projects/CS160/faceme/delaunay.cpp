#include <stdio.h>
#include <opencv2/imgproc/imgproc.hpp>
#include <opencv2/highgui/highgui.hpp>

#include <iostream>
#include <string>
#include <fstream>
#include <stdlib.h>
#include <string.h>



using namespace cv;
using namespace std;

FILE *fp;

FILE *file1;




typedef struct face_landmark_node 
{
  int frame;
  int indice;
  float x;
  float y;
  struct face_landmark_node *next;
} face_landmark_node;





static void draw_point (Mat &img, Point2f fp, Scalar color)
{
  circle (img, fp, 3, color, CV_FILLED, CV_AA, 0);
}




 
static void draw_delaunay (Mat &img, Subdiv2D &subdiv, Scalar delaunay_color)
{
  vector<Vec6f> triangleList;
  subdiv.getTriangleList(triangleList);
  vector<Point> pt(3);
  Size size = img.size();
  Rect rect(0,0, size.width, size.height);
 
  for (size_t i = 0; i < triangleList.size(); i++)
  {
    Vec6f t = triangleList[i];
    pt[0] = Point(cvRound(t[0]), cvRound(t[1]));
    pt[1] = Point(cvRound(t[2]), cvRound(t[3]));
    pt[2] = Point(cvRound(t[4]), cvRound(t[5]));
         
    // Draw rectangles completely inside the image.
    if (rect.contains(pt[0]) && rect.contains(pt[1]) && rect.contains(pt[2]))
    {
      line (img, pt[0], pt[1], delaunay_color, 1, CV_AA, 0);
      line (img, pt[1], pt[2], delaunay_color, 1, CV_AA, 0);
      line (img, pt[2], pt[0], delaunay_color, 1, CV_AA, 0);
    }
  }
}





static void run (face_landmark_node *face_landmark_list_head , char *argv[])
{
  face_landmark_node *face_landmark_element;
  Scalar delaunay_color(255,0,0), points_color(0, 0, 255); // Note: delaunay_color and points_color are in BGR (BLUE, GREEN, RED) format
  Mat source_image;
  Size source_image_resolution;
  char input_filename[1280], output_filename[1280]; // 1024 bytes for path + 256 bytes for filename  = 1280 bytes.

  memset (&input_filename, 0, sizeof(input_filename) - 1);
  memset (&output_filename, 0, sizeof(input_filename) - 1);
  strncpy (&input_filename[0], "rob.png", sizeof(input_filename) - 1);
 //   strncpy (&input_filename[0], "rob.png", sizeof(input_filename) - 1);
  snprintf (&output_filename[0], sizeof(output_filename) - 1,  "OUTPUT-%s", &input_filename[0]);
  if (input_filename[0] != '\0')
  {
    source_image = imread (&input_filename[0]);
    if (!source_image.empty())
    {
      source_image_resolution = source_image.size();
      Rect rect(0, 0, source_image_resolution.width, source_image_resolution.height);
      Subdiv2D subdiv(rect);

      face_landmark_element = face_landmark_list_head;
      while (face_landmark_element != NULL)
      {
        subdiv.insert(Point2f(face_landmark_element->x, face_landmark_element->y));
        face_landmark_element = face_landmark_element->next;
      }
      draw_delaunay (source_image, subdiv, delaunay_color);
      face_landmark_element = face_landmark_list_head;
      while (face_landmark_element != NULL)
      {
        draw_point (source_image, Point2f(face_landmark_element->x, face_landmark_element->y), points_color);
        face_landmark_element = face_landmark_element->next;
      }
      imwrite (&output_filename[0], source_image);
    }
  }
}





face_landmark_node * add_face_landmark_element (face_landmark_node *face_landmark_list_head, int frame, int indice, float pixel_location_x, float pixel_location_y)
{
  face_landmark_node *new_face_landmark_element, *face_landmark_element, *previous_face_landmark_element;

  new_face_landmark_element = (face_landmark_node *) malloc (sizeof (face_landmark_node));
  if (new_face_landmark_element != NULL)
  {
    new_face_landmark_element->frame = frame;
    new_face_landmark_element->indice = indice;
    new_face_landmark_element->x = pixel_location_x;
    new_face_landmark_element->y = pixel_location_y;
    new_face_landmark_element->next = NULL;
    if (face_landmark_list_head != NULL)
    {
      face_landmark_element = face_landmark_list_head;
      while (face_landmark_element->next != NULL) 
      {
        face_landmark_element = face_landmark_element->next;
      }
      face_landmark_element->next = new_face_landmark_element;
    }
    else
    {
      face_landmark_list_head = new_face_landmark_element;
    }
  }
  return face_landmark_list_head;
}





face_landmark_node * load_face_landmark_data (face_landmark_node *face_landmark_list_head, char argv[])
{
	//connect DB ?
	// or grab from argv[2]
    FILE *fp;
    char line[256];
    char *string;
    float x;
    float y;
    char *ret;
    const char ch = ' ';
//face_landmark_list_head = add_face_landmark_element (face_landmark_list_head, 1, 0, x, y);
//  face_landmark_list_head = add_face_landmark_element (face_landmark_list_head, 1, 0, 124.0f, 594.0f);
    //char directory[] = "/var/www/html/Assignment 6/dataoriginal.txt";
    fp = fopen(argv, "r");


   fgets(line, 256, fp);
    //printf("Line 1: %s\n", line);
   fgets(line, 256, fp);
    //printf("Line 2: %s\n", line);
    fgets(line, 256, fp);
    //printf("Line 3: %s\n", line);
    fgets(line, 256, fp); //grabs the fourth line
    //printf("Line 4: %s\n", line);

    for(int i = 1; i <= 68; i++) {
        string = strtok(line, " "); //grabs the first token
        x = atof(string);
        //printf("X #%d is: %lf\n",i, x);
        string = strtok(NULL, " "); //grabs the first token
        y = atof(string);
        //printf("Y #%d is: %lf\n",i, y);
        face_landmark_list_head = add_face_landmark_element (face_landmark_list_head, 1, i, x, y);
        fgets(line, 256, fp);
    }



    fclose(fp);
    return face_landmark_list_head;
}




int main (int argc, char *argv[]) 
{
  face_landmark_node *face_landmark_list_head, *face_landmark_element;

  face_landmark_list_head = NULL;
  face_landmark_list_head = load_face_landmark_data (face_landmark_list_head, argv[2]);
  //  system("mkdir -p video_output");


//for(int i = 1; i<argc; i++)
//{

	face_landmark_node *face_landmark_element2;
  Scalar delaunay_color(255,0,0), points_color(0, 0, 255); // Note: delaunay_color and points_color are in BGR (BLUE, GREEN, RED) format
  Mat source_image;
  Size source_image_resolution;
  char input_filename[1280], output_filename[1280]; // 1024 bytes for path + 256 bytes for filename  = 1280 bytes.

  memset (&input_filename, 0, sizeof(input_filename) - 1);
  memset (&output_filename, 0, sizeof(input_filename) - 1);
  strncpy (&input_filename[0], argv[1], sizeof(input_filename) - 1);
 //   strncpy (&input_filename[0], "rob.png", sizeof(input_filename) - 1);
  snprintf (&output_filename[0], sizeof(output_filename) - 1,  "%s-OUTPUTS.png", &input_filename[0]);

//printf("%s", &input_filename[0]);

 // system("mkdir -p foo/bar/xyz");








	
  if (input_filename[0] != '\0')
  {
    source_image = imread (&input_filename[0]);
    if (!source_image.empty())
    {
      source_image_resolution = source_image.size();
      Rect rect(0, 0, source_image_resolution.width, source_image_resolution.height);
      Subdiv2D subdiv(rect);

      face_landmark_element2 = face_landmark_list_head;
      while (face_landmark_element2 != NULL)
      {
        subdiv.insert(Point2f(face_landmark_element2->x, face_landmark_element2->y));
        face_landmark_element2 = face_landmark_element2->next;
      }
      draw_delaunay (source_image, subdiv, delaunay_color);
      face_landmark_element2 = face_landmark_list_head;
      while (face_landmark_element2 != NULL)
      {
        draw_point (source_image, Point2f(face_landmark_element2->x, face_landmark_element2->y), points_color);
        face_landmark_element2 = face_landmark_element2->next;
      }

       	//char str[100]; //= &output_filename[0];
      	//strcpy(str,"/video_output/");
		//strcat(str,&output_filename[0]);
      


      //	printf("%s\n", str);
       // printf("%s\n", source_image);

      imwrite (&output_filename[0], source_image);
      //imwrite (str, source_image);




    }
  //}

}




  while (face_landmark_list_head != NULL)
  {
    face_landmark_element = face_landmark_list_head;
    face_landmark_list_head = face_landmark_list_head->next;
    free (face_landmark_element);
    face_landmark_element = NULL;
  }
  exit (0);
}
