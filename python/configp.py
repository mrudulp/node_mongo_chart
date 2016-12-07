#python configp.py -f test_config.ini -v -njs -ro -mdb
import ConfigParser
import argparse
import os

class ConfigP(object):

    def __init__(self, fname):
        self.Config = ConfigParser.ConfigParser()
        self.Config.read(os.path.abspath(fname))

    def ConfigSectionMap(self, section):
        dict1 = {}
        options = self.Config.options(section)
        print("Options:{}".format(options))
        for option in options:
            try:
                dict1[option] = self.Config.get(section, option)
                if dict1[option] == -1:
                    print("skip: %s" % option)
            except:
                print("exception on %s!" % option)
                dict1[option] = None
        return dict1


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=" Configuration Parser reads relevant ini given to the program")
    parser.add_argument("-f","--configFile", metavar='<CONFIG FILE>', help='Config file name')
    parser.add_argument("-v","--verbose",  help='Print parsed config data', action='store_true')
    parser.add_argument("-mdb","--mongo",  help='Parse only mongodb config data', action='store_true')
    parser.add_argument("-njs","--nodejs",  help='Parse only nodejs config data', action='store_true')
    parser.add_argument("-ro","--robot",  help='Parse only robot config data', action='store_true')

    args = parser.parse_args()
    config = ""
    if args.configFile:
        config = ConfigP(args.configFile)
    else:
        config = ConfigP("test_config.ini")
    
    if args.mongo:
        cmap = config.ConfigSectionMap("MongoDb")
        if args.verbose:
            print(cmap["mongo_db"])
            print(cmap["mongo_collection"])
            print(cmap["mongo_port"])
            print(cmap["mongo_host"])
    
    if args.nodejs:
        cmap = config.ConfigSectionMap("NodeJs")
        if args.verbose:
            print(cmap["nodejs_port"])
            print(cmap["nodejs_host"])
    
    if args.robot:
        cmap = config.ConfigSectionMap("Robot")
        if args.verbose:
            print(cmap["robot_jsondir"])
            print(cmap["robot_capturedir"])
            print(cmap["robot_outputdir"])

