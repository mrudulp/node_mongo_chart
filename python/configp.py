import ConfigParser
import argparse

class ConfigP(object):

    def __init__(self, fname):
        self.Config = ConfigParser.ConfigParser()
        self.Config.read(fname)

    def ConfigSectionMap(section):
        dict1 = {}
        options = self.Config.options(section)
        for option in options:
            try:
                dict1[option] = self.Config.get(section, option)
                if dict1[option] == -1:
                    DebugPrint("skip: %s" % option)
            except:
                print("exception on %s!" % option)
                dict1[option] = None
        return dict1


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=" Configuration Parser reads relevant ini given to the program")
    parser.add_argument('string', metavar='<FILE>', type='string', nargs='+', help='Config file name')
    args = parser.parse_args()
    config = ConfigP(args)

